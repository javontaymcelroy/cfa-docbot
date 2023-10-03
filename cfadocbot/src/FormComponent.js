import React, { useState } from 'react';
import { Checkbox, Button, Dropdown, TextField, Typography } from 'cfa-react-components';
import axios from 'axios';
import './output.css';
import './FormComponent.scss';
import ReactMarkdown from 'react-markdown';

const openAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const apiKey = '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';
const docGuide = require('./componentDocGuide.js');

function FormComponent() {
    const [component, setComponent] = useState({
        name: '',
        props: [{ type: '', value: '' }],
        variantTypes: [{ name: '', value: '' }], 
        overview: '',
        storybookDocs: '',
        chatGptResponses: ''
    });

    const fetchGptResponse = async (userInput) => {
        try {
            const response = await axios.post(
                openAI_API_URL,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: `You are the Chick-fil-A design system and component library documentation bot. Adhere to this framework and guide for writing: ${docGuide}. Here's the component information: ${userInput}.`
                    }, {
                        role: 'user',
                        content: userInput
                    }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    }
                }
            );
            setComponent(prevComponent => ({
                ...prevComponent,
                chatGptResponses: response.data.choices[0].message.content
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setComponent(prevComponent => ({
            ...prevComponent,
            [name]: value
        }));
    };

    const addProp = (newProp) => {
        setComponent(prevComponent => ({
            ...prevComponent,
            props: [...prevComponent.props, newProp]
        }));
    };

    const editProp = (index, value) => {
        const valueMapping = {
          'String': 'string',
          'Value': 'value',
          'Boolean': 'boolean'
        };
        const updatedProps = component.props.map((prop, idx) => idx === index ? { ...prop, type: valueMapping[value] } : prop);
        setComponent(prevComponent => ({
            ...prevComponent,
            props: updatedProps
        }));
    };

    const deleteProp = (index) => {
        const updatedProps = component.props.filter((_, idx) => idx !== index);
        setComponent(prevComponent => ({
            ...prevComponent,
            props: updatedProps
        }));
    };

    const addVariantType = (newVariantType) => {
        setComponent(prevComponent => ({
            ...prevComponent,
            variantTypes: [...prevComponent.variantTypes, newVariantType]
        }));
    };

    const editVariantType = (index, updatedVariantType) => {
        const updatedVariantTypes = component.variantTypes.map((variantType, idx) => idx === index ? updatedVariantType : variantType);
        setComponent(prevComponent => ({
            ...prevComponent,
            variantTypes: updatedVariantTypes
        }));
    };

    const deleteVariantType = (index) => {
        const updatedVariantTypes = component.variantTypes.filter((_, idx) => idx !== index);
        setComponent(prevComponent => ({
            ...prevComponent,
            variantTypes: updatedVariantTypes
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchGptResponse(component.overview);  // Fetch GPT-3 response on submit
    };

    const propTypes = ['String', 'Value', 'Boolean'];
    


    return (
        <div className='form-container'>
          <Typography className="doc-form__title" variant='h1'>Component Documentation Form</Typography>
          <form className="doc-form" onSubmit={handleSubmit}>
            <div className="doc-fields__container">
            <div className="doc-form__component-name section-group">
              <TextField
                label='Component name'
                type="text" 
                name="name" 
                value={component.name} 
                onChange={handleInputChange} 
                placeholder="i.e. Button" 
                required
                className="doc-form__input"
                fullWidth
              />
            </div>
              <div className="doc-form__props section-group">
                {component.props.map((prop, index) => (
                  <div key={index} className="doc-form__prop-item">
                    <Dropdown 
                    label='Component props'
                    value={prop.type} 
                    onChange={value => editProp(index, value)}
                    required
                    className="doc-form__select input__form"
                    options={propTypes}
                    placeholder='Choose a prop type'
                    fullWidth
                    />
                  <div className="doc-form__input-field input__form">
                      {prop.type === 'boolean' ? (
                        <Checkbox 
                          checked={prop.value === 'true'} 
                          onChange={e => editProp(index, { ...prop, value: e.target.checked ? 'true' : 'false' })}
                        />
                      ) : (
                        <>
                          <TextField 
                            type={prop.type === 'value' ? "number" : "text"} 
                            value={prop.value} 
                            onChange={e => editProp(index, { ...prop, value: e.target.value })}
                            placeholder="Enter value"
                            required={prop.type !== ''}
                            label='Value'
                            fullWidth
                          />
                        </>
                      )}
                    </div>
                    <button type="button" onClick={() => deleteProp(index)} className="doc-form__btn">🗑️</button>
                  </div>
                ))}
                <Button color='primary' href='' onClick={() => addProp({ type: '', value: '' })} size='md' variant='text' fullWidth className='form-btn'>+ Add Prop</Button>
              </div>
                <div className="variant__types section-group">
                    <Typography as="" color='default' variant='h4'>Component overview</Typography>
                    {component.variantTypes.map((variantType, index) => (
                        <div key={index} className="variant-type-item">
                            <TextField 
                                type="text" 
                                value={variantType.name} 
                                onChange={e => editVariantType(index, { ...variantType, name: e.target.value })}
                                placeholder="i.e. Status" 
                                className='input__form'
                                label='Title'
                            />
                            <TextField 
                                type="text" 
                                value={variantType.value} 
                                onChange={e => editVariantType(index, { ...variantType, value: e.target.value })}
                                placeholder="i.e. Information" 
                                className='input__form'
                                label='Name'
                            />
                            <button type="button" onClick={() => deleteVariantType(index)} className='doc-form__btn'>🗑️</button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => addVariantType({ name: '', value: '' })} size='md' variant='text' fullWidth className='form-btn'>+ Add Variant Type</Button>
                </div>
                <div className="overview-management">
                    {/* <Typography as="" color='default' variant='h4'>Component overview</Typography> */}
                    <div className='input-field'>
                    <TextField
                        cols={40} 
                        helperText='Helper text'
                        fullWidth
                        label='Component overview'
                        multiline
                        rows={5}
                        textAlign='start'
                        name="overview" 
                        value={component.overview} 
                        onChange={handleInputChange} 
                        placeholder="Provide a brief overview of the component."
                    />
                    </div>
                </div>
                <button type="submit">Submit</button>
            </div>
            <div className='response-component'>
                <ReactMarkdown>
                    {component.chatGptResponses}
                </ReactMarkdown>
            </div>
        </form>
        </div>
    );    
}

export default FormComponent;
