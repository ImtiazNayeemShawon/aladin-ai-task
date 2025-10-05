import React, { useState } from 'react'
import api from '../lib/api';

export default function Form() {
    const [formData, setFormData] = useState({
        sandboxName: '',
        template: '',
        sandboxDescription: '',
        sandboxTags: ''
    });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.sandboxName || !formData.template) {
            alert('Please fill in Sandbox Name and select a Template');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/create', formData);

            const data = await res.data;

            if (data.success) {
                setResponse(data);
                setShowModal(true);
            } else {
                alert('Failed to create sandbox: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create sandbox. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSameSite = () => {
        window.location.href = `/editor/${response.id}`;
    };

    const handleNewTab = () => {
        window.open(response.editorUrl, '_blank');
        window.open(response.previewUrl, '_blank');
        setShowModal(false);
        setFormData({
            sandboxName: '',
            template: '',
            sandboxDescription: '',
            sandboxTags: ''
        });
    };

    return (
        <>
            <div className='space-y-4'>
                <p className='text-center'>Enter your sandbox information</p>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="sandboxName">Sandbox Name</label>
                    <input 
                        type="text" 
                        name="sandboxName"
                        value={formData.sandboxName}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder="Type here" 
                        className="input w-full" 
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="template">Template</label>
                    <select 
                        name="template"
                        value={formData.template}
                        onChange={(e) => handleInputChange(e.target)}
                        className="select select-secondary w-full"
                    >
                        <option value="" disabled>Pick a template</option>
                        <option value="kd848j">React (JS)</option>
                        <option value="fxis37">Next.js</option>
                        <option value="3mk9y8">Node Express Server</option>
                        <option value="in2qez">Python</option>
                        <option value="ej14tt">Go</option>
                        <option value="rk69p3">Rust</option>
                    </select>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="sandboxDescription">Sandbox Description</label>
                    <input 
                        type="text" 
                        name="sandboxDescription"
                        value={formData.sandboxDescription}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder="Type here" 
                        className="input w-full" 
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="sandboxTags">Sandbox Tags (comma-separated)</label>
                    <input 
                        type="text" 
                        name="sandboxTags"
                        value={formData.sandboxTags}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder="e.g., react, frontend, demo" 
                        className="input w-full" 
                    />
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className='btn border w-full cursor-pointer px-10 py-2 rounded-xl bg-amber-50 text-black font-bold hover:bg-amber-100 disabled:opacity-50'
                >
                    {loading ? 'Creating...' : 'Create Now'}
                </button>
            </div>

            {showModal && response && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className=" rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
                        <h2 className="text-xl font-bold text-center">Sandbox Created Successfully! </h2>
                        <p className="text-center text-gray-100">{response?.message}</p>
                        <div className="space-y-2 text-sm text-gray-100">
                        </div>
                        <p className="text-center font-medium">How would you like to open it?</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSameSite}
                                className='btn border w-full cursor-pointer px-10 py-2 rounded-xl bg-amber-50 text-black font-bold hover:bg-amber-100 disabled:opacity-50'
                                >
                                Open in Same Site
                            </button>
                            <button
                                onClick={handleNewTab}
                                className='btn border w-full cursor-pointer px-10 py-2 rounded-xl bg-amber-50 text-black font-bold hover:bg-amber-100 disabled:opacity-50'
                                >
                                Open in New Tabs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}