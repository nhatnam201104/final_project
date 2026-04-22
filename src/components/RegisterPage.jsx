import { useState } from "react";
import styles from "../styles/RegisterPage.module.css";

export default function RegisterPage({ onComplete }) {
  const [form, setForm] = useState({
    fullName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg viewBox="0 0 60 60" fill="none" className={styles.logoSvg}>
              <rect width="60" height="60" rx="12" fill="#1e40af" />
              <text
                x="30"
                y="40"
                textAnchor="middle"
                fill="white"
                fontSize="28"
                fontWeight="bold"
              >
                ĐH
              </text>
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-800">
            HỆ THỐNG QUẢN LÝ ĐỒ ÁN
          </h1>
          <p className="text-sm text-gray-500">
            Trường Đại học Sài Gòn — Khoa Công nghệ Thông tin
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200/60"
        >
          <h2 className="mb-1 text-base font-semibold text-gray-800">
            Đăng ký tài khoản
          </h2>
          <p className="mb-5 text-xs text-gray-400">
            Vui lòng điền thông tin để đăng ký hệ thống
          </p>

          <div className="space-y-4">
            <Field
              label="Họ và tên"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className={styles.spinner} />
                Đang xử lý...
              </span>
            ) : (
              "Đăng ký"
            )}
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Đã có tài khoản?{" "}
            <span className="cursor-pointer text-blue-600 hover:underline">
              Đăng nhập
            </span>
          </p>
        </form>

        <p className="mt-4 text-center text-[10px] text-gray-300">
          © 2025 Trường Đại học Sài Gòn. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${error ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-gray-50/50"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
