import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageLogo } from '../common/VillageLogo';
import { Modal } from '../common/Modal';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Shield,
  CreditCard,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, setCurrentView, selectedServiceForForm } = useApp();
  const [emailOrNik, setEmailOrNik] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrNik.trim()) {
      setErrorMessage('Silakan masukkan Email atau NIK.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    const result = login(emailOrNik, password);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const handleQuickLoginCitizen = () => {
    setEmailOrNik('siwi.siswanto@gmail.com');
    setPassword('123456');
    setErrorMessage('');
    login('siwi.siswanto@gmail.com', '123456');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <VillageLogo size="lg" showSubtitle={false} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Masuk ke Layanan Desa Adimulya
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan akun terdaftar untuk mengajukan surat dan memantau status berkas
          </p>
        </div>

        {/* Selected Service Notice */}
        {selectedServiceForForm && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs rounded-xl flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <div>
              <span className="font-bold block text-emerald-900">
                Permohonan: {selectedServiceForForm.title}
              </span>
              <span className="text-[11px] text-emerald-800">
                Silakan masuk dengan akun warga Anda untuk melanjutkan pengajuan. Belum punya akun? Klik <strong>Daftar Akun Baru</strong> di bawah.
              </span>
            </div>
          </div>
        )}

        {/* Demo Quick-Fill Pill Group */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Akses Cepat Pengujian:
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('admin-login')}
              className="text-[11px] font-semibold text-slate-700 hover:text-emerald-700 underline flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Petugas Desa
            </button>
          </div>
          <button
            type="button"
            onClick={handleQuickLoginCitizen}
            className="w-full px-3 py-2 bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-800 text-xs rounded-lg font-medium shadow-2xs hover:bg-emerald-50/50 transition-colors text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Gunakan Akun Contoh: <strong>Siwi Siswanto</strong></span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Masuk Cepat →</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email atau NIK (Nomor Induk Kependudukan)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={emailOrNik}
                onChange={(e) => {
                  setEmailOrNik(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="nama@email.com atau 3301021405880001"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Lupa sandi?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Masukkan kata sandi (demo: 123456)"
                className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#198754] hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Masuk Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Belum memiliki akun warga?{' '}
            <button
              onClick={() => setCurrentView('register')}
              className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Daftar Akun Baru
            </button>
          </p>
          <button
            onClick={() => setCurrentView('public')}
            className="text-xs text-slate-400 hover:text-slate-600 mt-3 inline-block"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export const RegisterView: React.FC = () => {
  const { register, setCurrentView, villageStats } = useApp();
  const [formData, setFormData] = useState({
    nik: '',
    noKk: '',
    nama: '',
    noHp: '',
    email: '',
    dusun: 'Dusun Cihandiwung Lor',
    rt: '001',
    rw: '001',
    alamat: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nik.trim()) {
      errs.nik = 'NIK wajib diisi.';
    } else if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      errs.nik = 'NIK harus berupa 16 digit angka.';
    }

    if (!formData.noKk.trim()) {
      errs.noKk = 'Nomor KK wajib diisi.';
    } else if (formData.noKk.length !== 16 || !/^\d+$/.test(formData.noKk)) {
      errs.noKk = 'Nomor KK harus 16 digit angka.';
    }

    if (!formData.nama.trim()) {
      errs.nama = 'Nama lengkap sesuai KTP wajib diisi.';
    }

    if (!formData.noHp.trim()) {
      errs.noHp = 'Nomor HP/WhatsApp aktif wajib diisi.';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Email tidak valid.';
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Kata sandi minimal 6 karakter.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'Anda harus menyetujui pemrosesan data kependudukan.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = register({
      nik: formData.nik,
      noKk: formData.noKk,
      nama: formData.nama,
      noHp: formData.noHp,
      email: formData.email,
      dusun: formData.dusun,
      rt: formData.rt,
      rw: formData.rw,
      alamat: formData.alamat || `RT ${formData.rt} / RW ${formData.rw}, ${formData.dusun}`,
      password: formData.password,
    });

    if (!res.success) {
      setErrors({ form: res.message });
    }
  };

  return (
    <div className="min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <VillageLogo size="lg" showSubtitle={false} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Akun Warga Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lengkapi data kependudukan untuk aktivasi akun pelayanan online Desa Adimulya
          </p>
        </div>

        {errors.form && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK (16 Digit) *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                  placeholder="330102xxxxxxxxxx"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.nik ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.nik && <p className="text-[11px] text-rose-600 mt-1">{errors.nik}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kartu Keluarga (KK) *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  maxLength={16}
                  value={formData.noKk}
                  onChange={(e) => setFormData({ ...formData, noKk: e.target.value.replace(/\D/g, '') })}
                  placeholder="330102xxxxxxxxxx"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.noKk ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.noKk && <p className="text-[11px] text-rose-600 mt-1">{errors.noKk}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap (sesuai KTP) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  errors.nama ? 'border-rose-400' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.nama && <p className="text-[11px] text-rose-600 mt-1">{errors.nama}</p>}
          </div>

          {/* Wilayah Dusun & RT/RW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Wilayah Dusun (Desa Adimulya) *
              </label>
              <select
                value={formData.dusun}
                onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {villageStats.dusunList.map((dusun, idx) => (
                  <option key={idx} value={dusun}>
                    {dusun}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                RT / RW
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={3}
                  value={formData.rt}
                  onChange={(e) => setFormData({ ...formData, rt: e.target.value.replace(/\D/g, '') })}
                  placeholder="RT"
                  className="w-1/2 px-2 py-2 text-sm border border-slate-300 rounded-lg text-center"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="text"
                  maxLength={3}
                  value={formData.rw}
                  onChange={(e) => setFormData({ ...formData, rw: e.target.value.replace(/\D/g, '') })}
                  placeholder="RW"
                  className="w-1/2 px-2 py-2 text-sm border border-slate-300 rounded-lg text-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor HP / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.noHp ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.noHp && <p className="text-[11px] text-rose-600 mt-1">{errors.noHp}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email Aktif *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.email ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.password ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Konfirmasi Kata Sandi *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Ulangi kata sandi"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.confirmPassword ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 leading-normal">
                Saya menyatakan bahwa data yang saya masukkan adalah sah dan bersedia diverifikasi oleh Pemerintah Desa Adimulya sesuai peraturan perundang-undangan.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-[11px] text-rose-600 mt-1">{errors.agreeTerms}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 px-4 bg-[#198754] hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Lanjutkan ke Verifikasi OTP
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 mt-6">
          <p className="text-xs text-slate-600">
            Sudah memiliki akun warga?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const OtpVerificationView: React.FC = () => {
  const { verifyOtp, pendingOtpEmail, setCurrentView, showToast } = useApp();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes countdown
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const formatCountdown = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Auto advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Silakan isi 6 digit kode verifikasi OTP.');
      return;
    }

    const res = verifyOtp(fullCode);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleFillDemoCode = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setErrorMessage('');
  };

  const handleResend = () => {
    setTimerSeconds(300);
    setOtpDigits(['', '', '', '', '', '']);
    showToast('Kode OTP baru telah disimulasikan ke email Anda.', 'info');
  };

  // Mask email: b***o@gmail.com
  const maskedEmail = (() => {
    const parts = (pendingOtpEmail || 'warga@desa-adimulya.id').split('@');
    if (parts.length < 2) return pendingOtpEmail;
    const name = parts[0];
    const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name}***`;
    return `${maskedName}@${parts[1]}`;
  })();

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-[#198754]">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Verifikasi Kode OTP
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Kami telah mengirimkan 6 digit kode konfirmasi ke alamat email:
        </p>
        <p className="text-xs font-semibold text-slate-800 font-mono mt-0.5">
          {maskedEmail}
        </p>

        {/* Demo reminder card */}
        <div className="my-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 text-left">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Simulasi Kode Demo: 123456</span>
            <button
              type="button"
              onClick={handleFillDemoCode}
              className="text-xs text-emerald-700 underline font-semibold hover:text-emerald-900"
            >
              Isi Otomatis
            </button>
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-1">
            Dalam mode prototype, verifikasi disimulasikan secara instan tanpa pengiriman email sungguhan.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          {/* 6 Digit inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50/50"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <span>Kode kedaluwarsa dalam:</span>
            <span className="font-mono font-semibold text-slate-800">
              {formatCountdown(timerSeconds)}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#198754] hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
          >
            Verifikasi & Masuk
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-xs">
          <button
            onClick={handleResend}
            disabled={timerSeconds > 240}
            className={`flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold ${
              timerSeconds > 240 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Kirim Ulang Kode OTP
          </button>

          <button
            onClick={() => setCurrentView('login')}
            className="text-slate-400 hover:text-slate-600 mt-2"
          >
            ← Kembali ke Halaman Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [emailOrNik, setEmailOrNik] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrNik.trim()) return;
    setIsSent(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsSent(false);
        onClose();
      }}
      title="Pemulihan Kata Sandi Akun Warga"
      maxWidth="md"
    >
      {isSent ? (
        <div className="text-center py-4 space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Instruksi Terkirim!</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Link pemulihan kata sandi telah disimulasikan ke kontak terdaftar:{' '}
            <span className="font-semibold">{emailOrNik}</span>. Silakan periksa kotak masuk atau hubungi petugas desa.
          </p>
          <button
            onClick={() => {
              setIsSent(false);
              onClose();
            }}
            className="w-full mt-4 py-2 bg-[#198754] text-white rounded-lg text-xs font-semibold"
          >
            Selesai
          </button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Masukkan Email atau NIK yang terdaftar pada sistem kependudukan Desa Adimulya. Kami akan mengirimkan tautan reset kata sandi sementara.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email atau NIK Warga
            </label>
            <input
              type="text"
              required
              value={emailOrNik}
              onChange={(e) => setEmailOrNik(e.target.value)}
              placeholder="budi.santoso@gmail.com atau 3301021405880001"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#198754] text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
            >
              Kirim Link Pemulihan
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
