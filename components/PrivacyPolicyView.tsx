import React, { useState, useEffect } from 'react';

const privacyStyles = `
    .qran-top-privacy-body {
        font-family: 'Tajawal', sans-serif;
        background-color: var(--color-background);
        color: var(--color-text-primary);
        line-height: 1.8;
        margin: 0;
        padding: 0;
    }
    .qran-top-privacy-container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: var(--color-surface);
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .qran-top-privacy-body header {
        border-bottom: 2px solid var(--color-primary);
        padding-bottom: 1rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    .qran-top-privacy-body h1 {
        color: var(--color-primary-text-strong);
        font-size: 2.5rem;
        margin: 0;
    }
    .qran-top-privacy-body h2 {
        color: var(--color-primary-text);
        font-size: 1.8rem;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--color-border-subtle);
        padding-bottom: 0.5rem;
    }
    .qran-top-privacy-body h3 {
        color: var(--color-text-primary);
        font-size: 1.4rem;
        margin-top: 2rem;
    }
    .qran-top-privacy-body p, .qran-top-privacy-body li {
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }
    .qran-top-privacy-body ul {
        padding-right: 20px;
    }
    .qran-top-privacy-body strong {
        color: var(--color-primary-text-strong);
    }
    .qran-top-privacy-body a {
        color: var(--color-primary-text);
        text-decoration: none;
    }
    .qran-top-privacy-body a:hover {
        text-decoration: underline;
    }
    .qran-top-privacy-body footer {
        text-align: center;
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border-default);
        color: var(--color-text-muted);
    }
    .qran-top-privacy-body .lang-en {
        direction: ltr;
        text-align: left;
        font-family: 'Roboto', sans-serif;
    }
    .qran-top-privacy-body .lang-en ul {
         padding-right: 0;
         padding-left: 20px;
    }
    .qran-top-privacy-body .lang-toggle {
        text-align: center;
        margin-bottom: 2rem;
    }
    .qran-top-privacy-body .lang-toggle button {
        background-color: var(--color-surface-hover);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Tajawal', sans-serif;
    }
    .qran-top-privacy-body .lang-toggle button.active {
        background-color: var(--color-primary);
        color: var(--color-primary-text-strong);
    }
    html.dark .qran-top-privacy-body .lang-toggle button.active {
        color: var(--color-background);
    }
`;

const PrivacyPolicyView: React.FC = () => {
    const [lang, setLang] = useState<'ar' | 'en'>('ar');

    useEffect(() => {
        const originalLang = document.documentElement.lang;
        const originalDir = document.documentElement.dir;

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        return () => {
            document.documentElement.lang = originalLang;
            document.documentElement.dir = originalDir;
        };
    }, [lang]);

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = '#/';
    }

    return (
        <>
            <style>{privacyStyles}</style>
            <div className="qran-top-privacy-body">
                <div className="qran-top-privacy-container">
                    <header>
                        <h1 id="header-title">{lang === 'ar' ? 'سياسة الخصوصية لتطبيق QRAN.TOP' : 'Privacy Policy - QRAN.TOP'}</h1>
                        <p id="header-date">آخر تحديث: 9 أغسطس 2024</p>
                    </header>
                    
                    <div className="lang-toggle">
                        <button id="btn-ar" className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>العربية</button>
                        <button id="btn-en" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
                    </div>

                    <div id="arabic-content" style={{ display: lang === 'ar' ? 'block' : 'none' }}>
                        <section>
                            <h2>مقدمة</h2>
                            <p>نحن في تطبيق <strong>QRAN.TOP</strong> نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة نوع المعلومات التي نجمعها وكيفية استخدامها، مع التأكيد على أننا لا نجمع أي بيانات شخصية تعريفية عنك.</p>
                        </section>

                        <section>
                            <h2>البيانات التي يتم التعامل معها</h2>
                            <h3>البيانات المخزنة محلياً على جهازك (لا نصل إليها)</h3>
                            <p>لتحسين تجربتك، يتم تخزين بعض البيانات مباشرة في متصفحك. هذه البيانات تظل على جهازك بالكامل ولا يتم إرسالها إلى خوادمنا:</p>
                            <ul>
                                <li><strong>تفضيلات التطبيق:</strong> يتم حفظ اختيارك للمظهر (فاتح/داكن)، ونوع الخط، وحجم الخط، واختيار القارئ الصوتي المفضل، وقائمة المصادر (التفاسير والترجمات) النشطة.</li>
                                <li><strong>دفتر التدبر:</strong> يتم حفظ جميع المجموعات والآيات والأبحاث والملاحظات التي تضيفها إلى "دفتر التدبر" في التخزين المحلي لمتصفحك (localStorage). هذه البيانات خاصة بك تماماً.</li>
                                <li><strong>التخزين المؤقت للمصحف (Cache):</strong> لتسريع تحميل التطبيق، يتم تخزين بعض نصوص المصحف والتطبيق الأساسية في الذاكرة المؤقتة لمتصفحك.</li>
                            </ul>
                            
                            <h3>البيانات المخزنة على خوادمنا (بشكل مجهول الهوية)</h3>
                            <p>بعض البيانات التفاعلية يتم تخزينها على خوادم Firebase بشكل مجهول الهوية تماماً لتمكين الميزات الجماعية:</p>
                            <ul>
                                <li><strong>التعليقات:</strong> عند إضافة تعليق، يتم تخزين نص التعليق والطابع الزمني بشكل مجهول. لا نربط التعليقات بأي حساب شخصي.</li>
                                <li><strong>ترند النقاشات:</strong> عند فتحك لنافذة النقاش حول كلمة معينة، نقوم بزيادة عدّاد لهذا الموضوع بشكل مجهول. الهدف هو فقط معرفة المواضيع الأكثر إثارة للاهتمام بشكل عام.</li>
                                <li><strong>مزامنة دفتر التدبر (بشكل مؤقت):</strong> عند استخدامك لميزة "تصدير دفتر التدبر"، يتم تخزين نسخة مشفرة من دفترك على خوادمنا بشكل مؤقت وربطها بكود عشوائي ومجهول. الهدف الوحيد من هذا التخزين هو السماح لك بنقل بياناتك إلى جهاز آخر. يتم حذف هذه البيانات نهائياً من خوادمنا بمجرد استخدام كود الاستيراد بنجاح. نحن لا نطلع على محتوى دفترك.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2>العامل الخفي (Service Worker)</h2>
                            <p>يستخدم التطبيق تقنية "العامل الخفي" لتخزين الملفات الأساسية للتطبيق (مثل الواجهة والأيقونات) في ذاكرة التخزين المؤقت لجهازك. هذا يسمح للتطبيق بالعمل بسرعة فائقة ويوفر واجهة أساسية حتى في حالة عدم وجود اتصال بالإنترنت. لا يتم استخدام هذه التقنية لجمع أي بيانات شخصية.</p>
                        </section>
                        
                        <section>
                            <h2>الإشراف على المحتوى</h2>
                            <p>يمكن للمستخدمين الإبلاغ عن أي تعليق غير لائق. يحتفظ مشرفو الموقع بالحق في مراجعة وحذف أي محتوى يخالف شروط الاستخدام.</p>
                        </section>

                        <section>
                            <h2>التغييرات على السياسة</h2>
                            <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ "آخر تحديث" في الأعلى.</p>
                        </section>

                        <section>
                            <h2>اتصل بنا</h2>
                            <p>إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر تلغرام: <a href="https://t.me/aboharon_com" target="_blank" rel="noopener noreferrer">t.me/aboharon_com</a>.</p>
                        </section>
                    </div>
                    
                    <div id="english-content" className="lang-en" style={{ display: lang === 'en' ? 'block' : 'none' }}>
                        <section>
                            <h2>Introduction</h2>
                            <p>At <strong>QRAN.TOP</strong>, we take your privacy seriously. This policy explains what information we handle and how it's used, emphasizing that we do not collect any personally identifiable information from you.</p>
                        </section>

                        <section>
                            <h2>Data We Handle</h2>
                            <h3>Data Stored Locally on Your Device (We don't access it)</h3>
                            <p>To enhance your experience, some data is stored directly in your browser. This data remains entirely on your device and is not sent to our servers:</p>
                            <ul>
                                <li><strong>App Preferences:</strong> Your choice of theme (light/dark), font type, font size, preferred audio reciter, and your list of active editions (tafsirs and translations) are saved.</li>
                                <li><strong>Tadabbur Notebook:</strong> All collections, ayahs, searches, and notes you add to your notebook are stored in your browser's local storage. This data is yours alone.</li>
                                <li><strong>Quran Cache:</strong> To speed up the app's loading time, essential Quran texts and the basic app shell are cached in your browser.</li>
                            </ul>

                            <h3>Data Stored on Our Servers (Anonymously)</h3>
                            <p>Some interactive data is stored on Firebase servers completely anonymously to enable community features:</p>
                            <ul>
                                <li><strong>Comments:</strong> When you add a comment, the text and a timestamp are stored anonymously. We do not link comments to any personal accounts.</li>
                                <li><strong>Discussion Trends:</strong> When you open a discussion panel for a specific keyword, we anonymously increment a counter for that topic. The sole purpose is to understand which topics are most interesting to users collectively.</li>
                                <li><strong>Notebook Sync (Temporary):</strong> When you use the "Export Notebook" feature, an encrypted copy of your notebook is stored temporarily on our servers and linked to a random, anonymous code. The sole purpose of this storage is to allow you to transfer your data to another device. This data is permanently deleted from our servers as soon as the import code is successfully used. We do not view your notebook's content.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2>Service Worker</h2>
                            <p>The application uses "Service Worker" technology to cache the app's core files (like the interface and icons). This allows the app to load extremely fast and provides a basic interface even when you're offline. This technology is not used to collect any personal data.</p>
                        </section>

                        <section>
                            <h2>Content Moderation</h2>
                            <p>Users can report any inappropriate comments. Site moderators reserve the right to review and delete any content that violates the terms of use.</p>
                        </section>

                        <section>
                            <h2>Changes to This Policy</h2>
                            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date at the top.</p>
                        </section>
                        
                        <section>
                            <h2>Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us via Telegram: <a href="https://t.me/aboharon_com" target="_blank" rel="noopener noreferrer">t.me/aboharon_com</a>.</p>
                        </section>
                    </div>

                    <footer>
                        <a href="#/" onClick={handleHomeClick}>العودة إلى التطبيق الرئيسي</a>
                        <p>&copy; 2024 - <a href="https://aboharon.com" target="_blank" rel="noopener noreferrer">aboharon.com</a>. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyView;
