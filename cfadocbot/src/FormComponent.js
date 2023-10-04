import React, { useState } from 'react';
import { Checkbox, Button, Dropdown, TextField, Typography } from 'cfa-react-components';
import axios from 'axios';
import './output.css';
import './FormComponent.scss';
import ReactMarkdown from 'react-markdown';

const openAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const apiKey = 'wH53LOPplruMmGU6DJMdT3BlbkFJ2MgACTs1ZT8mQOwuMMGh';
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
                        content: `You are the Chick-fil-A design system and component library documentation bot. Adhere to this framework and guide for writing: ${docGuide}. Format the response using Markdow. Here's the component information: ${userInput}.`
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
            props: [...prevComponent.props, { ...newProp, title: '' }]
        }));
    };

    const editTitle = (index, title) => {
        const updatedProps = [...component.props];
        updatedProps[index] = { ...updatedProps[index], title };
        setComponent(prevComponent => ({
          ...prevComponent,
          props: updatedProps
        }));
    };      

    const editProp = (index, value) => {
        const updatedProps = [...component.props];
        updatedProps[index] = { ...updatedProps[index], type: value };
        setComponent(prevComponent => ({
          ...prevComponent,
          props: updatedProps
        }));
    };  
      
    const editPropValue = (index, value) => {
    const updatedProps = [...component.props];
    updatedProps[index].value = value;
    setComponent(prevComponent => ({
        ...prevComponent,
        props: updatedProps
    }));
    };
      
    const editBooleanProp = (index, value) => {
        const updatedProps = component.props.map((prop, idx) => {
            if (idx === index) {
                return { ...prop, value: value ? 'true' : 'false' };
            }
            return prop;
        });
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
        <div className='form__container'>
            <Typography variant='h3' className='doc-title'>Component Documentation Form</Typography>
            <form onSubmit={handleSubmit} className='form__content'>
                <div className='form__field__container'>
                    <div  className='form__section'>
                        <TextField
                            label='Component name'
                            type="text"
                            name="name"
                            value={component.name}
                            onChange={handleInputChange}
                            placeholder="i.e. Button"
                            required
                            fullWidth
                        />
                    </div>
                    <div>
                        {component.props.map((prop, index) => (
                            <div key={index} className='form__section'>
                                <Dropdown
                                    label='Component prop'
                                    value={prop.type}
                                    onChange={value => editProp(index, value)}
                                    options={propTypes}
                                    placeholder='Choose a prop type'
                                    className='form__input'
                                    fullWidth
                                />
                                <TextField
                                    type="text"
                                    value={prop.title || ''}
                                    onChange={e => editTitle(index, e.target.value)}
                                    placeholder="Title"
                                    label='Title'
                                    required
                                    className='form__input'
                                    fullWidth
                                />
                                {prop.type === 'Boolean' ? (
                                    <Checkbox
                                        checked={prop.value === 'true'}
                                        onChange={e => editBooleanProp(index, e.target.checked)}
                                    />
                                ) : prop.type === 'Value' ? (
                                    <TextField
                                        type="number"
                                        value={prop.value}
                                        onChange={e => editPropValue(index, e.target.value)}
                                        placeholder="0"
                                        required={true}
                                        label='Value'
                                        className='form__input'
                                        fullWidth
                                    />
                                ) : (
                                    <TextField
                                        type="text"
                                        value={prop.value}
                                        onChange={e => editPropValue(index, e.target.value)}
                                        placeholder="String value"
                                        required={prop.type !== ''}
                                        label='Value'
                                        className='form__input'
                                        fullWidth
                                    />
                                )}
                                <button type="button" onClick={() => deleteProp(index)} className='form__btn'>-</button>
                            </div>
                        ))}
                        <Button color='primary' href='' onClick={() => addProp({ type: '', value: '' })} size='md' variant='text'>+ Add Prop</Button>
                    </div>
                    <div>
                        <Typography as="" color='default' variant='h4'>Component overview</Typography>
                        {component.variantTypes.map((variantType, index) => (
                            <div key={index} className='form__section'>
                                <TextField
                                    type="text"
                                    value={variantType.name}
                                    onChange={e => editVariantType(index, { ...variantType, name: e.target.value })}
                                    placeholder="i.e. Status"
                                    label='Title'
                                    fullWidth
                                    className='form__input'
                                />
                                <TextField
                                    type="text"
                                    value={variantType.value}
                                    onChange={e => editVariantType(index, { ...variantType, value: e.target.value })}
                                    placeholder="i.e. Information"
                                    label='Name'
                                    fullWidth
                                    className='form__input'
                                />
                                <button type="button" onClick={() => deleteVariantType(index)}  className='form__btn'>-</button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => addVariantType({ name: '', value: '' })} size='md' variant='text'>+ Add Variant Type</Button>
                    </div>
                    <div>
                        <div>
                            <TextField
                                cols={40}
                                helperText='Hint: If an overview exists in Storybook, copy & paste that here!'
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
                    <Button type="submit" fullWidth className='form__submit__btn'>Submit</Button>
                </div>
                <div>
                    <ReactMarkdown>
                        {component.chatGptResponses}
                    </ReactMarkdown>
                </div>
            </form>
        </div>
    );     
}

export default FormComponent;
