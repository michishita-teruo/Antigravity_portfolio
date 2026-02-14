import React, { useState } from 'react';
const GOOGLE_FORM_ACTION_URL = import.meta.env.VITE_GOOGLE_FORM_ACTION_URL;
const ENTRY_ID_NAME = import.meta.env.VITE_ENTRY_ID_NAME;
const ENTRY_ID_EMAIL = import.meta.env.VITE_ENTRY_ID_EMAIL;
const ENTRY_ID_SUBJECT = import.meta.env.VITE_ENTRY_ID_SUBJECT;
const ENTRY_ID_MESSAGE = import.meta.env.VITE_ENTRY_ID_MESSAGE;

export const RetroMail: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple Text CAPTCHA
        if (captcha !== 'A' && captcha !== 'a') {
            alert('認証エラー：Antigravityの頭文字は「A」です。');
            return;
        }

        if (GOOGLE_FORM_ACTION_URL.includes('YOUR_FORM_ID')) {
            alert('エラー：Googleフォームの設定が完了していません。コード内のIDを設定してください。');
            return;
        }

        // Submission to Google Forms
        const formData = new FormData();
        formData.append(ENTRY_ID_NAME, name);
        formData.append(ENTRY_ID_EMAIL, email);
        formData.append(ENTRY_ID_SUBJECT, subject);
        formData.append(ENTRY_ID_MESSAGE, message);

        try {
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Forms
                body: formData
            });
            setSent(true);
        } catch (error) {
            alert('送信エラーが発生しました。時間を置いて再度お試しください。');
            console.error(error);
        }
    };

    if (sent) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl text-yellow-300 mb-4">Thank You!!</h2>
                <p>メールは無事に送信されました。</p>
                <p>Googleスプレッドシートに記録されました。</p>
                <button onClick={() => setSent(false)} className="mt-8 text-blue-300 underline">
                    戻る
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl text-red-400 border-b-2 border-red-600 mb-6 text-center">
                ★☆★ Mail ★☆★
            </h2>

            <div className="bg-[#330000] border border-red-800 p-4 mb-8 text-sm text-gray-300">
                <div className="flex gap-4 items-center mb-4">
                    <div className="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center border-4 border-white animate-bounce text-pink-700 font-bold">
                        P〇stPet
                    </div>
                    <div>
                        <p className="text-yellow-300 font-bold">メールを送る前の注意！</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>チェーンメールは絶対に送らないでください。</li>
                            <li>「不幸の手紙」も禁止です。</li>
                            <li>スパム対策導入済み（認証クイズあり）。</li>
                            <li>送信ボタンを押すとメーラーが立ち上がります。</li>
                        </ul>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-red-300">Name (HN)</label>
                    <input type="text" data-testid="name-input" required value={name} onChange={e => setName(e.target.value)} className="bg-black border border-red-500 text-white px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-red-300">Mail Address</label>
                    <input type="email" data-testid="email-input" required value={email} onChange={e => setEmail(e.target.value)} className="bg-black border border-red-500 text-white px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-red-300">Subject</label>
                    <input type="text" data-testid="subject-input" value={subject} onChange={e => setSubject(e.target.value)} className="bg-black border border-red-500 text-white px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-red-300">Message</label>
                    <textarea required rows={8} data-testid="message-input" value={message} onChange={e => setMessage(e.target.value)} className="bg-black border border-red-500 text-white px-2 py-1" />
                </div>

                {/* CAPTCHA */}
                <div className="flex flex-col gap-1 bg-red-900/30 p-2 border border-red-500/50">
                    <label className="text-yellow-300 text-xs">【スパム対策】「Antigravity」の頭文字(アルファベット1文字)は？</label>
                    <input type="text" data-testid="captcha-input" required value={captcha} onChange={e => setCaptcha(e.target.value)} className="bg-black border border-yellow-500 text-white px-2 py-1 w-20 text-center" />
                </div>

                <div className="text-center pt-4">
                    <button type="submit" data-testid="submit-button" className="bg-gradient-to-b from-gray-200 to-gray-400 text-black border-2 border-white px-8 py-2 font-bold shadow-lg hover:from-white hover:to-gray-200 active:translate-y-1">
                        送 信
                    </button>
                </div>
            </form>
        </div>
    );
};
