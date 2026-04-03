import React from 'react';
import { 
    LogoIcon, BookOpenIcon, SearchIcon, ShieldCheckIcon, UsersIcon, ArrowLeftIcon, 
    UserCircleIcon, MenuIcon, SpeakerWaveIcon, BookmarkIcon, SparklesIcon, CogIcon, 
    ChatBubbleIcon, MicrophoneIcon, MoonIcon 
} from './icons';

const AboutView: React.FC = () => {
    
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (href) {
            window.location.hash = href;
        }
    };

    const FeatureItem: React.FC<{icon: React.ReactNode, title: string, description: React.ReactNode}> = ({icon, title, description}) => (
        <li className="bg-surface p-6 rounded-lg shadow-sm border border-border-default flex items-start gap-4">
            <div className="text-primary flex-shrink-0 mt-1">{icon}</div>
            <div>
                <h3 className="font-bold text-lg text-text-primary">{title}</h3>
                <p className="text-sm text-text-muted mt-1">{description}</p>
            </div>
        </li>
    );

    const SignItem: React.FC<{symbol: string, title: string, description: string, symbolStyle?: React.CSSProperties}> = ({symbol, title, description, symbolStyle}) => (
        <li className="bg-surface p-4 rounded-lg shadow-sm border border-border-default flex items-center gap-4">
             <div className="sign-symbol flex-shrink-0 w-14 h-14 bg-surface-subtle border-2 border-border-default rounded-full flex items-center justify-center font-quran-title text-2xl text-primary" style={symbolStyle}>
                {symbol}
            </div>
            <div>
                <h3 className="font-bold text-md text-text-primary">{title}</h3>
                <p className="text-sm text-text-muted">{description}</p>
            </div>
        </li>
    );
    
    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <LogoIcon className="w-20 h-20 text-primary mx-auto mb-4"/>
                <h1 className="text-4xl font-bold text-primary-text-strong">دليل استخدام QRAN.TOP</h1>
                <p className="text-xl text-text-secondary mt-2">مستكشف قرآني يجمع بين قوة البحث وعمق التدبر</p>
            </header>
            
            <main className="space-y-12">
                <section id="general-idea">
                    <h2 className="text-2xl font-semibold mb-4 text-text-primary border-r-4 border-primary pr-4">الفكرة العامة</h2>
                    <p className="text-lg text-text-secondary leading-relaxed">
                        تطبيق <strong>QRAN.TOP</strong> هو أداة ويب متقدمة تهدف إلى تسهيل عملية البحث في المصحف الشريف وتعميق فهمه. يعتمد التطبيق على فلسفة بسيطة: الجمع بين الدقة التقنية وسهولة الاستخدام. لتحقيق ذلك، نستخدم نسختين من المصحف: نسخة بالرسم <strong>العثماني</strong> الأصيل لتجربة قراءة مريحة ومطابقة للمصحف، ونسخة بالرسم <strong>الإملائي المبسط</strong> التي تعمل كمحرك بحث قوي ودقيق يسمح باستكشاف الكلمات والعبارات بكفاءة عالية.
                    </p>
                </section>

                <section id="quran-signs">
                    <h2 className="text-2xl font-semibold mb-6 text-text-primary border-r-4 border-primary pr-4">دليل علامات المصحف الشريف</h2>
                    <p className="text-text-secondary mb-4">يستخدم مصحف المدينة المنورة (النسخة العثمانية في التطبيق) علامات دقيقة لضبط التلاوة والتجويد والوقف. إليك شرح لأهم هذه العلامات:</p>
                    <h3 className="text-xl font-bold mb-4 text-text-primary">أولاً: علامات الوقف</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SignItem symbol="مـ" title="الوقف اللازم" description="يجب الوقف هنا، لأن الوصل قد يغير المعنى." />
                        <SignItem symbol="لا" title="الوقف الممنوع" description="لا يجوز الوقف هنا (إلا لضرورة)، ويجب إعادة ما قبله عند الوصل." />
                        <SignItem symbol="ج" title="الوقف الجائز" description="يجوز الوقف ويجوز الوصل، وكلاهما سواء." />
                        <SignItem symbol="صلى" title="الوصل أولى" description="يجوز الوقف، ولكن الوصل أفضل لإتمام المعنى." />
                        <SignItem symbol="قلى" title="الوقف أولى" description="يجوز الوصل، ولكن الوقف أفضل." />
                        <SignItem symbol="∴ ∴" title="وقف التعانق" description="إذا وقفت على أحد الموضعين، فلا تقف على الآخر." symbolStyle={{fontSize: '1rem'}}/>
                    </ul>
                    <h3 className="text-xl font-bold my-4 pt-4 border-t border-border-default">ثانياً: علامات ضبط التجويد</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SignItem symbol="~" title="علامة المد" description="توضع فوق الحرف للدلالة على مد زائد عن المد الطبيعي." />
                        <SignItem symbol="ۢ" title="الميم الصغيرة (الإقلاب)" description="توضع فوق النون الساكنة لتدل على قلب النون إلى ميم عند ملاقاتها للباء." />
                        <SignItem symbol="حـ" title="رأس الخاء (الإظهار)" description="توضع فوق الحرف الساكن لتدل على وجوب إظهاره (سكون مظهر)." />
                        <SignItem symbol="○" title="الصفر المستدير" description="يدل على أن الحرف زيادة في الرسم ولا ينطق لا وصلاً ولا وقفاً." />
                    </ul>
                </section>

                <section id="key-features">
                    <h2 className="text-2xl font-semibold mb-6 text-text-primary border-r-4 border-primary pr-4">أهم الميزات</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureItem icon={<MenuIcon className="w-8 h-8"/>} title="قائمة جانبية شاملة" description="يمكنك الوصول إلى كل شيء في التطبيق من مكان واحد: الفهرس، دفتر التدبر، الإعدادات، وأدوات تخصيص العرض." />
                        <FeatureItem icon={<SpeakerWaveIcon className="w-8 h-8"/>} title="الاستماع للقرآن الكريم" description="استمع إلى تلاوات عطرة من نخبة من القرّاء. اختر قارئك المفضل واستمتع بتجربة استماع متكاملة مع شريط تحكم دائم." />
                        <FeatureItem icon={<SearchIcon className="w-8 h-8"/>} title="بحث تفاعلي عميق" description="ابحث عن أي كلمة أو عبارة، بالبحث النصي أو الصوتي، واكتشف التراكيب اللغوية الأكثر شيوعاً، وتعمق في جذور الكلمات." />
                        <FeatureItem icon={<BookmarkIcon className="w-8 h-8"/>} title="دفتر تدبر متكامل" description="احفظ الآيات والأبحاث، ودوّن ملاحظاتك وتدبراتك عليها. يمكنك أيضاً تصدير دفترك بالكامل ونقله إلى جهاز آخر بسهولة." />
                        <FeatureItem icon={<SparklesIcon className="w-8 h-8"/>} title="أدوات استكشاف فريدة" description={<><strong>رحلة الرقم:</strong> ابحث عن كل الآيات التي تحمل نفس الرقم في جميع سور المصحف.<br/><strong>الانتقال إلى التكرار:</strong> اقفز مباشرة إلى أي تكرار لكلمة البحث في كامل المصحف.</>} />
                        <FeatureItem icon={<CogIcon className="w-8 h-8"/>} title="تخصيص كامل للقراءة" description="اختر من بين مجموعة من الخطوط القرآنية، وتحكم بحجم الخط، وقم بإدارة التفاسير والترجمات التي ترغب في عرضها." />
                        <FeatureItem icon={<UsersIcon className="w-8 h-8"/>} title="نقاشات وتدبر جماعي" description="شارك في ختمة جماعية مع الأصدقاء، أو شارك في نقاشات حول الكلمات القرآنية لإثراء فهمك." />
                        <FeatureItem icon={<ShieldCheckIcon className="w-8 h-8"/>} title="تجربة عصرية (PWA)" description={<><strong>ثبّت التطبيق:</strong> أضف التطبيق إلى شاشة جهازك الرئيسية للوصول إليه بسرعة.<br/><strong>يعمل بدون انترنت:</strong> بعد زيارتك الأولى، ستعمل الواجهة الأساسية بسرعة فائقة.</>} />
                    </ul>
                </section>

                <section id="ai-api-key">
                    <h2 className="text-2xl font-semibold mb-4 text-text-primary border-r-4 border-primary pr-4">الحصول على مفتاح API للذكاء الاصطناعي (Gemini)</h2>
                    <div className="bg-surface p-6 rounded-lg shadow-sm border border-border-default space-y-4">
                        <p className="text-text-secondary">ميزة "معنى المثاني" تستخدم نماذج الذكاء الاصطناعي المتقدمة من Google لتحليل البيانات اللغوية. هذه الخدمة لها تكلفة تشغيلية، لذلك ستحتاج إلى استخدام مفتاح API الخاص بك من Google AI Studio لتفعيل هذه الميزة.</p>
                        <p className="text-text-secondary">الحصول على المفتاح مجاني ضمن الباقة التي توفرها Google. يتم حفظ المفتاح بشكل آمن في متصفحك فقط ولا يتم إرساله إلى خوادمنا.</p>
                        <h3 className="text-lg font-bold text-text-primary pt-2">خطوات الحصول على المفتاح:</h3>
                        <ol className="list-decimal pr-6 text-text-secondary space-y-2">
                            <li>اذهب إلى <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary-text hover:underline">Google AI Studio</a>.</li>
                            <li>قم بتسجيل الدخول بحساب Google الخاص بك، ثم انقر على زر "Create API key".</li>
                            <li>سيظهر لك مفتاح طويل. انقر على أيقونة النسخ بجانبه.</li>
                            <li>الصق المفتاح في التطبيق عندما يُطلب منك، أو أضفه من <strong>الإعدادات &larr; الذكاء الاصطناعي</strong>.</li>
                        </ol>
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-r-4 border-yellow-400 text-sm text-yellow-800 dark:text-yellow-200">
                           <strong>ملاحظة هامة:</strong> أنت مسؤول عن أي استخدام أو تكاليف قد تترتب على مفتاح API الخاص بك. يتم حفظ المفتاح بشكل آمن في متصفحك فقط ولا يتم إرساله إلى خوادمنا.
                        </div>
                    </div>
                </section>

                <section id="sources">
                    <h2 className="text-2xl font-semibold mb-4 text-text-primary border-r-4 border-primary pr-4">مصادر البيانات والشفافية</h2>
                    <div className="bg-surface p-6 rounded-lg shadow-sm border border-border-default space-y-4">
                        <p className="text-text-secondary">نحن نؤمن بالشفافية الكاملة، لذا نوضح مصادر البيانات التي يعتمد عليها التطبيق:</p>
                        <ul className="list-disc pr-5 space-y-2 text-sm text-text-muted">
                            <li><strong>النص القرآني:</strong> نعتمد على النصوص الموثوقة من واجهة برمجة التطبيقات العامة <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer" className="text-primary-text hover:underline">alquran.cloud</a>.</li>
                            <li><strong>التلاوات الصوتية:</strong> مصدرها شبكات توصيل محتوى عامة ومتاحة للجميع مثل <a href="https://everyayah.com/" target="_blank" rel="noopener noreferrer" className="text-primary-text hover:underline">everyayah.com</a> و <a href="https://cdn.islamic.network/" target="_blank" rel="noopener noreferrer" className="text-primary-text hover:underline">islamic.network</a>.</li>
                        </ul>
                        <p className="text-xs text-text-subtle">يعمل التطبيق كوسيط لعرض هذه البيانات، ودقتها وموثوقيتها تقع على عاتق مصادرها الأصلية. لمزيد من التفاصيل، يرجى مراجعة <a href="#/privacy-policy" onClick={handleLinkClick} className="text-primary-text hover:underline">سياسة الخصوصية</a>.</p>
                    </div>
                </section>

                <section className="text-center">
                     <h2 className="text-2xl font-semibold mb-4 text-text-primary">المطور</h2>
                     <div className="inline-flex flex-col items-center gap-2">
                        <UserCircleIcon className="w-16 h-16 text-text-muted"/>
                        <p className="font-semibold text-text-secondary">
                            تم تطوير هذا التطبيق بواسطة <a href="https://aboharon.com" target="_blank" rel="noopener noreferrer" className="text-primary-text font-bold hover:underline">aboharon.com</a> بمساعدة Google Studio.
                        </p>
                        <a href="https://t.me/aboharon_com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-text hover:underline">
                            للتواصل والإبلاغ عن أي ملاحظات
                        </a>
                    </div>
                </section>
            </main>
            
            <footer className="mt-12 pt-8 border-t border-border-default text-center">
                 <a href="#/" onClick={handleLinkClick} className="inline-flex items-center gap-2 text-lg font-semibold text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة إلى الفهرس</span>
                </a>
            </footer>
        </div>
    );
};

export default AboutView;
