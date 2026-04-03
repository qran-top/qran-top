
import React from 'react';

const manualStyles = `
    .qran-top-manual-body {
        font-family: 'Tajawal', sans-serif;
        background-color: var(--color-background);
        color: var(--color-text-primary);
        line-height: 1.8;
        margin: 0;
        padding: 0;
    }
    .qran-top-manual-container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: var(--color-surface);
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .qran-top-manual-body header {
        border-bottom: 2px solid var(--color-primary);
        padding-bottom: 1rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    .qran-top-manual-body h1 {
        color: var(--color-primary-text-strong);
        font-size: 2.5rem;
        margin: 0;
    }
    .qran-top-manual-body h2 {
        color: var(--color-primary-text);
        font-size: 1.8rem;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--color-border-subtle);
        padding-bottom: 0.5rem;
    }
    .qran-top-manual-body h3 {
        color: var(--color-text-primary);
        font-size: 1.4rem;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }
    .qran-top-manual-body p {
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }
    .qran-top-manual-body ul {
        list-style: none;
        padding: 0;
    }
    .qran-top-manual-body li {
        background-color: var(--color-surface-subtle);
        border-right: 4px solid var(--color-primary);
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .qran-top-manual-body .icon-svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        stroke: var(--color-primary-text);
        fill: var(--color-text-muted);
    }
    .qran-top-manual-body .feature-icon {
         width: 32px;
        height: 32px;
        flex-shrink: 0;
        stroke: var(--color-primary-text);
    }
    .qran-top-manual-body strong {
        color: var(--color-primary-text-strong);
    }
    .qran-top-manual-body code {
        background-color: var(--color-surface-hover);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 1rem;
    }
    .qran-top-manual-body .note {
        background-color: var(--color-surface-subtle);
        border-right: 4px solid #f59e0b; /* yellow-500 */
        padding: 1rem;
        margin-top: 1.5rem;
        border-radius: 5px;
    }
    .qran-top-manual-body .feature-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
    }
    .qran-top-manual-body .feature-description {
        font-size: 1rem;
        color: var(--color-text-secondary);
    }
    .qran-top-manual-body .sign-symbol {
        font-family: 'Uthman', 'Amiri Quran', serif;
        font-size: 1.8rem;
        color: var(--color-primary);
        background-color: var(--color-surface);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid var(--color-border-subtle);
        flex-shrink: 0;
    }
    .qran-top-manual-body .supporter-list li {
        background-color: #f0fdf4; /* light green */
        border-right-color: #ef4444; /* red for love/support */
    }
    html.dark .qran-top-manual-body .supporter-list li {
        background-color: #1a2c21;
    }
    .qran-top-manual-body .supporter-list .icon-svg {
        stroke: #ef4444;
    }
    .qran-top-manual-body footer {
        text-align: center;
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border-default);
        color: var(--color-text-muted);
    }
    .qran-top-manual-body a {
        color: var(--color-primary-text);
        text-decoration: none;
    }
    .qran-top-manual-body a:hover {
        text-decoration: underline;
    }
`;

const ManualView: React.FC = () => {
    return (
        <>
            <style>{manualStyles}</style>
            <div className="qran-top-manual-body">
                <div className="qran-top-manual-container">
                    <header>
                        <h1>دليل استخدام تطبيق QRAN.TOP</h1>
                        <p>شرح تفصيلي لآلية عمل التطبيق، فلسفته، وميزاته الأساسية.</p>
                    </header>

                    <section id="general-idea">
                        <h2>الفكرة العامة</h2>
                        <p>
                            تطبيق <strong>QRAN.TOP</strong> هو أداة ويب متقدمة تهدف إلى تسهيل عملية البحث في المصحف الشريف وتعميق فهمه. يعتمد التطبيق على فلسفة بسيطة: الجمع بين الدقة التقنية وسهولة الاستخدام. لتحقيق ذلك، نستخدم نسختين من المصحف: نسخة بالرسم <strong>العثماني</strong> الأصيل لتجربة قراءة مريحة ومطابقة للمصحف، ونسخة بالرسم <strong>الإملائي المبسط</strong> التي تعمل كمحرك بحث قوي ودقيق يسمح باستكشاف الكلمات والعبارات بكفاءة عالية.
                        </p>
                    </section>

                    <section id="quran-signs">
                        <h2>دليل علامات المصحف الشريف</h2>
                        <p>يستخدم مصحف المدينة المنورة (النسخة العثمانية في التطبيق) علامات دقيقة لضبط التلاوة والتجويد والوقف. إليك شرح لأهم هذه العلامات:</p>
                        
                        <h3>أولاً: علامات الوقف</h3>
                        <ul>
                            <li>
                                <div className="sign-symbol">مـ</div>
                                <div>
                                    <h3 className="feature-title">الوقف اللازم</h3>
                                    <p className="feature-description">يجب الوقف هنا، لأن الوصل قد يغير المعنى.</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol">لا</div>
                                <div>
                                    <h3 className="feature-title">الوقف الممنوع</h3>
                                    <p className="feature-description">لا يجوز الوقف هنا (إلا لضرورة)، ويجب إعادة ما قبله عند الوصل.</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol">ج</div>
                                <div>
                                    <h3 className="feature-title">الوقف الجائز</h3>
                                    <p className="feature-description">يجوز الوقف ويجوز الوصل، وكلاهما سواء.</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol">صلى</div>
                                <div>
                                    <h3 className="feature-title">الوصل أولى</h3>
                                    <p className="feature-description">يجوز الوقف، ولكن الوصل أفضل لإتمام المعنى.</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol">قلى</div>
                                <div>
                                    <h3 className="feature-title">الوقف أولى</h3>
                                    <p className="feature-description">يجوز الوصل، ولكن الوقف أفضل.</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol" style={{fontSize: '1.2rem'}}>∴ ∴</div>
                                <div>
                                    <h3 className="feature-title">وقف التعانق</h3>
                                    <p className="feature-description">إذا وقفت على أحد الموضعين، فلا تقف على الآخر.</p>
                                </div>
                            </li>
                        </ul>

                        <h3>ثانياً: علامات ضبط التجويد</h3>
                        <ul>
                            <li>
                                <div className="sign-symbol">~</div>
                                <div>
                                    <h3 className="feature-title">علامة المد</h3>
                                    <p className="feature-description">توضع فوق الحرف للدلالة على مد زائد عن المد الطبيعي (أكثر من حركتين).</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol">ۢ</div>
                                <div>
                                    <h3 className="feature-title">الميم الصغيرة (الإقلاب)</h3>
                                    <p className="feature-description">توضع فوق النون الساكنة لتدل على قلب النون إلى ميم عند ملاقاتها للباء (مثل: مِنۢ بَعْدِ).</p>
                                </div>
                            </li>
                             <li>
                                <div className="sign-symbol">حـ</div>
                                <div>
                                    <h3 className="feature-title">رأس الخاء (الإظهار)</h3>
                                    <p className="feature-description">توضع فوق الحرف الساكن لتدل على وجوب إظهاره (سكون مظهر). خلو الحرف منها يعني إدغامه أو إخفاءه.</p>
                                </div>
                            </li>
                            <li>
                                <div className="sign-symbol">○</div>
                                <div>
                                    <h3 className="feature-title">الصفر المستدير</h3>
                                    <p className="feature-description">يدل على أن الحرف زيادة في الرسم ولا ينطق لا وصلاً ولا وقفاً (مثل: أُوْلَـٰٓئِكَ).</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section id="key-features">
                        <h2>أهم ميزات التطبيق</h2>
                        <ul>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                                <div>
                                    <h3 className="feature-title">قائمة جانبية شاملة</h3>
                                    <p className="feature-description">يمكنك الوصول إلى كل شيء في التطبيق من مكان واحد: الفهرس، دفتر التدبر، الإعدادات، وأدوات تخصيص العرض.</p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
                                <div>
                                    <h3 className="feature-title">الاستماع للقرآن الكريم</h3>
                                    <p className="feature-description">استمع إلى تلاوات عطرة من نخبة من القرّاء. اختر قارئك المفضل واستمتع بتجربة استماع متكاملة مع شريط تحكم دائم.</p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                                <div>
                                    <h3 className="feature-title">بحث تفاعلي عميق</h3>
                                    <p className="feature-description">ابحث عن أي كلمة أو عبارة، بالبحث النصي أو <strong>الصوتي</strong>، واكتشف التراكيب اللغوية الأكثر شيوعاً، وتعمق في جذور الكلمات.</p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                                <div>
                                    <h3 className="feature-title">دفتر تدبر متكامل</h3>
                                    <p className="feature-description">احفظ الآيات والأبحاث، ودوّن ملاحظاتك وتدبراتك عليها. يمكنك أيضاً تصدير دفترك بالكامل ونقله إلى جهاز آخر بسهولة.</p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
                                <div>
                                    <h3 className="feature-title">أدوات استكشاف فريدة</h3>
                                    <p className="feature-description">
                                        <strong>رحلة الرقم:</strong> ابحث عن كل الآيات التي تحمل نفس الرقم في جميع سور المصحف.
                                        <br />
                                        <strong>الانتقال إلى التكرار:</strong> اقفز مباشرة إلى أي تكرار لكلمة البحث في كامل المصحف.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226a2.25 2.25 0 0 0 2.59-1.226 2.25 2.25 0 0 1 2.59 1.226c.55-.218 1.02-.684 1.11-1.226a2.25 2.25 0 0 1 2.59 1.226c.09.542.56 1.008 1.11 1.226" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                <div>
                                    <h3 className="feature-title">تخصيص كامل للقراءة</h3>
                                    <p className="feature-description">اختر من بين مجموعة من الخطوط القرآنية، وتحكم بحجم الخط، وقم بإدارة التفاسير والترجمات التي ترغب في عرضها.</p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m2.25 2.25H15M3.75 12a9 9 0 0 1 18 0v.001c0 4.97-4.03 9-9 9h-.375a9 9 0 0 1-8.625-9.002V12Z" /></svg>
                                <div>
                                    <h3 className="feature-title">نقاشات وتدبر جماعي</h3>
                                    <p className="feature-description">شارك في <strong>ختمة جماعية</strong> مع الأصدقاء، أو شارك في نقاشات حول الكلمات القرآنية لإثراء فهمك.</p>
                                </div>
                            </li>
                            <li>
                                <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                                <div>
                                    <h3 className="feature-title">تجربة عصرية (PWA)</h3>
                                    <p className="feature-description">
                                        <strong>ثبّت التطبيق:</strong> أضف التطبيق إلى شاشة جهازك الرئيسية للوصول إليه بسرعة مثل أي تطبيق آخر.
                                        <br />
                                        <strong>يعمل بدون انترنت:</strong> بعد زيارتك الأولى، ستعمل الواجهة الأساسية للتطبيق بسرعة فائقة حتى لو كان اتصالك بالإنترنت ضعيفاً أو منقطعاً.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section id="ai-api-key">
                        <h2>الحصول على مفتاح API للذكاء الاصطناعي (Gemini)</h2>
                        <p>
                            ميزة "معنى المثاني" تستخدم نماذج الذكاء الاصطناعي المتقدمة من Google لتحليل البيانات اللغوية. هذه الخدمة لها تكلفة تشغيلية، لذلك ستحتاج إلى استخدام مفتاح API الخاص بك من Google AI Studio لتفعيل هذه الميزة.
                        </p>
                        <p>
                            الحصول على المفتاح مجاني للاستخدام المحدود ضمن الباقة المجانية التي توفرها Google. يتم حفظ المفتاح بشكل آمن في متصفحك فقط ولا يتم إرساله إلى خوادمنا.
                        </p>
                        <h3>خطوات الحصول على المفتاح:</h3>
                        <ul>
                            <li>
                                <div>
                                    <strong>1. زيارة Google AI Studio:</strong> اذهب إلى الرابط التالي: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">https://aistudio.google.com/app/apikey</a>.
                                </div>
                            </li>
                            <li>
                                <div>
                                    <strong>2. إنشاء مفتاح جديد:</strong> قم بتسجيل الدخول بحساب Google الخاص بك، ثم انقر على زر "Create API key".
                                </div>
                            </li>
                            <li>
                                <div>
                                    <strong>3. نسخ المفتاح:</strong> سيظهر لك مفتاح طويل (سلسلة من الأحرف والأرقام). انقر على أيقونة النسخ بجانبه.
                                </div>
                            </li>
                            <li>
                                <div>
                                    <strong>4. لصق المفتاح في التطبيق:</strong>
                                    <br />
                                    - عندما يطلب منك التطبيق إدخال المفتاح، قم بلصقه في الحقل المخصص.
                                    <br />
                                    - أو يمكنك إضافته وتعديله في أي وقت من <strong>الإعدادات &larr; الذكاء الاصطناعي</strong>.
                                </div>
                            </li>
                        </ul>
                        <div className="note">
                            <p>
                                <strong>ملاحظة هامة:</strong> أنت مسؤول عن أي استخدام أو تكاليف قد تترتب على مفتاح API الخاص بك وفقاً لسياسات Google. يتم حفظ المفتاح بشكل آمن في متصفحك فقط ولا يتم إرساله إلى خوادمنا.
                            </p>
                        </div>
                    </section>

                    <section id="main-interface">
                        <h2>الواجهة الرئيسية</h2>
                        <p>عند فتح التطبيق، تظهر لك الواجهة الرئيسية التي تحتوي على المكونات التالية:</p>
                        <ul>
                            <li>
                                <div>
                                    <strong>قائمة السور:</strong> عرض لجميع سور القرآن الكريم البالغ عددها 114 سورة. بالضغط على أي سورة، يتم الانتقال إلى صفحة عرض تفاصيلها.
                                </div>
                            </li>
                            <li>
                                <div>
                                    <strong>شريط البحث العلوي:</strong> هو الأداة الرئيسية للبحث في كامل القرآن.
                                </div>
                            </li>
                        </ul>
                        <h3>وظائف أزرار الواجهة الرئيسية</h3>
                        <ul>
                            <li>
                                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                                <div><strong>زر البحث:</strong> بعد كتابة كلمة في مربع البحث، اضغط على هذا الزر لبدء عملية البحث في كامل نصوص القرآن.</div>
                            </li>
                            <li>
                                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                                <div><strong>البحث الصوتي:</strong> اضغط على أيقونة الميكروفون للتحدث والبحث بصوتك.</div>
                            </li>
                            <li>
                                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25c0 5.385 4.365 9.75 9.75 9.75 2.138 0 4.125-.683 5.752-1.848Z" /></svg>
                                <div><strong>زر تغيير المظهر:</strong> للتبديل بين الأوضاع المختلفة (نهاري، ليلي، ضحى، ظهر، عشاء) لتوفير راحة للعين.</div>
                            </li>
                        </ul>
                    </section>

                    <section id="surah-page">
                        <h2>صفحة عرض السورة</h2>
                        <p>
                            عند الضغط على أي سورة، تنتقل إلى صفحة العرض الخاصة بها. في هذه الصفحة، يتم عرض النص الكامل للسورة <strong>بالرسم العثماني</strong> الأصيل لتجربة قراءة تشبه المصحف.
                        </p>
                        <h3>أوضاع العرض (قراءة / بحث)</h3>
                        <p>تحتوي صفحة السورة على وضعين يمكن التبديل بينهما باستخدام زر مخصص في رأس الصفحة:</p>
                        <ul>
                            <li>
                                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                                <div>
                                    <strong>وضع القراءة "مصحف":</strong> يعرض السورة بصفحات مطابقة للمصحف المطبوع مع العلامات الجانبية للأحزاب والأجزاء.
                                </div>
                            </li>
                            <li>
                                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                                <div>
                                    <strong>وضع النص "عثماني":</strong> في هذا الوضع، يتم عرض النص كسرد مستمر، وتصبح كل كلمة قابلة للنقر لبدء بحث جديد عنها فوراً.
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section id="search-page">
                        <h2>صفحة البحث</h2>
                        <p>
                            هذه الصفحة تعرض نتائج البحث عن كلمة معينة. يتم تمييز الكلمة التي تم البحث عنها بلون مختلف داخل الآيات.
                        </p>
                        <h3>خيارات متقدمة</h3>
                         <ul>
                             <li>
                                <div>
                                    <strong>التراكيب المقترحة:</strong> يعرض التطبيق الكلمات التي تظهر غالباً بجوار كلمة بحثك. انقر عليها لإضافتها للبحث وتخصيص النتائج.
                                </div>
                            </li>
                            <li>
                                <div>
                                    <strong>إظهار المطابقة التامة فقط:</strong>
                                    عند تفعيل هذا الخيار، يقوم التطبيق بتصفية النتائج فوراً ليُظهر فقط الآيات التي تحتوي على كلمة البحث بشكلها المستقل تماماً.
                                </div>
                            </li>
                             <li>
                                <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m2.25 2.25H15M3.75 12a9 9 0 0 1 18 0v.001c0 4.97-4.03 9-9 9h-.375a9 9 0 0 1-8.625-9.002V12Z" /></svg>
                                <div>
                                    <strong>زر فتح النقاش:</strong> يفتح ساحة للنقاش حول الكلمة المبحوث عنها، حيث يمكنك قراءة تدبرات الآخرين أو إضافة تعليقك.
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section id="disclaimer-and-sources">
                        <h2>إخلاء مسؤولية ومصادر البيانات</h2>
                        
                        <h3>مصدر النص القرآني</h3>
                        <p>
                            النص القرآني الأساسي المستخدم في هذا التطبيق (بالرسم العثماني والرسم الإملائي) مصدره واجهة برمجة التطبيقات العامة <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">alquran.cloud API</a>. هذه البيانات تم تجميعها وتدقيقها من قبل جهات متعددة وهي مستخدمة على نطاق واسع.
                        </p>
                        <p>
                            نحن نثق في دقة النص المقدم من المصدر، ولكننا نخلي مسؤوليتنا عن أي خطأ بشري محتمل قد يكون حدث أثناء معالجة البيانات ودمجها في التطبيق. إن وجد أي خطأ، فهو غير مقصود ونسعى جاهدين لتصحيحه.
                        </p>
                        
                        <h3>مصادر الترجمات والتفاسير</h3>
                        <p>
                            يعتمد التطبيق على واجهات برمجية عامة ومصادر مفتوحة (مثل <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">alquran.cloud</a> ومشروع <a href="https://github.com/fawazahmed0/quran-api" target="_blank" rel="noopener noreferrer">quran-api</a>) لجلب بيانات الترجمات والتفاسير الإضافية. نحن نعمل كوسيط لعرض هذه البيانات فقط، ودقتها وموثوقيتها تقع على عاتق مصادرها الأصلية. نحن نخلي مسؤوليتنا عن أي أخطاء محتملة في محتوى هذه الترجمات أو التفاسير.
                        </p>

                        <h3>مصادر الصوتيات</h3>
                        <p>
                            تلاوات القرآن الكريم الصوتية في هذا التطبيق مصدرها شبكات توصيل محتوى (CDNs) عامة ومتاحة للجميع مثل <a href="https://everyayah.com/" target="_blank" rel="noopener noreferrer">everyayah.com</a> و <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">alquran.cloud</a>. يعمل تطبيقنا كمشغل صوتي لهذه المصادر الخارجية فقط. نحن لا نمتلك هذه الملفات الصوتية ولا نستضيفها، وبالتالي نخلي مسؤوليتنا عن جودتها أو دقتها أو مدى توفرها.
                        </p>
                        
                        <h3>هدفنا والتطوير</h3>
                        <p>
                            تم تطوير هذا البرنامج كأداة بحثية مساعدة لخدمة كتاب الله وتسهيل تدبره. نحن ملتزمون بتحسين التطبيق باستمرار وتلافي أي عيوب قد تظهر.
                        </p>
                        <p>
                            تمت برمجة هذا التطبيق بمساعدة <strong>Google Studio</strong>.
                        </p>
                        <div className="note">
                            <p>
                                <strong>للتواصل والإبلاغ عن أي ملاحظات أو اقتراحات، يرجى التواصل معنا عبر تلغرام:</strong>
                                <br />
                                <a href="https://t.me/aboharon_com" target="_blank" rel="noopener noreferrer">t.me/aboharon_com</a>
                            </p>
                        </div>
                    </section>

                    <footer>
                        <p>جميع الحقوق محفوظة &copy; 2024 - aboharon.com</p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ManualView;
