import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons';
import TadabburGateway from './settings/TadabburGateway';
import ExportFormatSettings from './settings/ExportFormatSettings';
import ApiKeySettings from './settings/ApiKeySettings';

interface SettingsViewProps {
    onExportNotebook: () => Promise<string>;
    onImportNotebook: (code: string) => Promise<void>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
    onExportNotebook, onImportNotebook
}) => {
    type Tab = 'tadabbur' | 'export_format' | 'api_key';
    const [activeTab, setActiveTab] = useState<Tab>('tadabbur');
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const tabParam = params.get('tab');
        if (tabParam === 'tadabbur' || tabParam === 'export_format' || tabParam === 'api_key') {
            setActiveTab(tabParam as Tab);
        }
    }, [window.location.hash]);
    
    return (
        <div className="animate-fade-in w-full max-w-5xl mx-auto px-4">
            <main className="bg-surface p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-300 relative">
                <div className="flex border-b border-border-default mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('tadabbur')}
                        className={`flex-shrink-0 px-4 py-3 text-lg font-semibold transition-colors ${
                            activeTab === 'tadabbur'
                                ? 'border-b-2 border-primary text-primary-text'
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                        aria-current={activeTab === 'tadabbur'}
                    >
                        دفتر التدبر
                    </button>
                     <button
                        onClick={() => setActiveTab('api_key')}
                        className={`flex-shrink-0 px-4 py-3 text-lg font-semibold transition-colors flex items-center gap-2 ${
                            activeTab === 'api_key'
                                ? 'border-b-2 border-primary text-primary-text'
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                        aria-current={activeTab === 'api_key'}
                    >
                        <SparklesIcon className="w-5 h-5" />
                        الذكاء الاصطناعي
                    </button>
                    <button
                        onClick={() => setActiveTab('export_format')}
                        className={`flex-shrink-0 px-4 py-3 text-lg font-semibold transition-colors ${
                            activeTab === 'export_format'
                                ? 'border-b-2 border-primary text-primary-text'
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                        aria-current={activeTab === 'export_format'}
                    >
                        تنسيق التصدير
                    </button>
                </div>

                <div>
                    {activeTab === 'tadabbur' && (
                        <TadabburGateway 
                            onExportNotebook={onExportNotebook}
                            onImportNotebook={onImportNotebook}
                        />
                    )}
                    {activeTab === 'api_key' && <ApiKeySettings />}
                    {activeTab === 'export_format' && (
                        <ExportFormatSettings />
                    )}
                </div>
            </main>
        </div>
    );
};

export default SettingsView;
