import React, { useState } from 'react';
import { SpinnerIcon, UploadIcon, DownloadIcon } from '../icons';

interface TadabburGatewayProps {
    onExportNotebook: () => Promise<string>;
    onImportNotebook: (code: string) => Promise<void>;
}

const TadabburGateway: React.FC<TadabburGatewayProps> = ({ onExportNotebook, onImportNotebook }) => {
    const [exportCode, setExportCode] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const [importCode, setImportCode] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const handleExport = async () => {
        setIsExporting(true);
        setExportError(null);
        setExportCode(null);
        setImportMessage(null);
        try {
            const code = await onExportNotebook();
            setExportCode(code);
        } catch (err) {
            setExportError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
        } finally {
            setIsExporting(false);
        }
    };
    
    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsImporting(true);
        setImportMessage(null);
        setExportError(null);
        setExportCode(null);
        try {
            await onImportNotebook(importCode);
            setImportMessage({ type: 'success', text: 'تم استيراد الدفتر بنجاح وحذف النسخة من الخادم.' });
            setImportCode('');
        } catch (err) {
            setImportMessage({ type: 'error', text: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-2 text-text-primary">بوابة دفتر التدبر</h2>
            <p className="text-text-secondary mb-8">استخدم هذه الواجهة لنقل بياناتك المحفوظة بين الأجهزة المختلفة.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-surface-subtle rounded-lg border border-border-default flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">تصدير دفتر التدبر</h3>
                    <p className="text-sm text-text-secondary mb-4 flex-grow">
                        أنشئ كوداً مؤقتاً لنقل دفترك إلى جهاز آخر. عند إنشاء كود جديد، يتم حذف أي كود قديم.
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                        {isExporting ? <SpinnerIcon className="w-5 h-5"/> : <UploadIcon className="w-5 h-5" />}
                        <span>{isExporting ? 'جاري إنشاء الكود...' : 'إنشاء كود تصدير'}</span>
                    </button>
                    {exportCode && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-md text-center">
                            <p className="text-sm text-green-800 dark:text-green-200">انسخ الكود التالي وضعه في جهازك الجديد:</p>
                            <div className="my-2 text-3xl font-mono font-bold tracking-widest text-green-700 dark:text-green-300 select-all">
                                {exportCode}
                            </div>
                        </div>
                    )}
                    {exportError && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-200 rounded-md text-sm">
                            {exportError}
                        </div>
                    )}
                </div>
                <div className="p-5 bg-surface-subtle rounded-lg border border-border-default flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">استيراد دفتر التدبر</h3>
                    <p className="text-sm text-text-secondary mb-4 flex-grow">
                        أدخل الكود المكون من 6 رموز (3 أحرف ثم 3 أرقام) الذي حصلت عليه من جهازك القديم.
                    </p>
                    <form onSubmit={handleImport}>
                        <input
                            type="text"
                            value={importCode}
                            onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                            maxLength={6}
                            placeholder="XYZ123"
                            className="w-full p-3 text-2xl font-mono tracking-widest text-center border border-border-default rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isImporting || importCode.length !== 6}
                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
                        >
                            {isImporting ? <SpinnerIcon className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5" />}
                            <span>{isImporting ? 'جاري الاستيراد...' : 'استيراد الدفتر'}</span>
                        </button>
                    </form>
                    {importMessage && (
                        <div className={`mt-4 p-3 rounded-md text-sm ${importMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-200'}`}>
                            {importMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TadabburGateway;
