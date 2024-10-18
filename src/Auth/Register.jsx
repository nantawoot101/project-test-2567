import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    role_id: "",
    username_id: "",
    password_id: "",
    confirm_password: "",
    Id_student: "",
    member_title: "",
    member_name: "",
    member_lastname: "",
    member_email: "",
    phone_number: "",
    faculity: "เทคโนโลยีสารสนเทศ",
    branch: "เทคโนโลยีสารสนเทศ",
    status: "1",
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await axios.get("http://localhost:9999/role/getAll");
        setRoles(response.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchAllRoles();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password_id !== formData.confirm_password) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await axios.post("http://localhost:9999/auth/register", formData);

      Swal.fire({
        title: "สำเร็จ",
        text: "ลงทะเบียนสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      navigate("/login");
    } catch (err) {
      if (err.response?.data?.error === "Email already exists") {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "อีเมลนี้มีอยู่ในระบบแล้ว",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: err.response?.data?.error || "เกิดข้อผิดพลาดในการลงทะเบียน",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <div className="bg-white p-6 border-2 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">ลงทะเบียนผู้ใช้</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="role_id" className="block text-sm font-medium mb-1">
                บทบาท
              </label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-200"
              >
                <option value="">-- เลือกบทบาท --</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            {formData.role_id && (
              <div>
                <label
                  htmlFor="Id_student"
                  className="block text-sm font-medium mb-1"
                >
                  {formData.role_id === "1" ? "รหัสนักศึกษา" : "รหัสอาจารย์"}
                </label>
                <input
                  type="text"
                  id="Id_student"
                  name="Id_student"
                  value={formData.Id_student}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  maxLength={13}
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="username_id"
              className="block text-sm font-medium mb-1"
            >
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              id="username_id"
              name="username_id"
              value={formData.username_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password_id"
              className="block text-sm font-medium mb-1"
            >
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password_id"
                name="password_id"
                value={formData.password_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 py-2 flex items-center text-gray-600"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium mb-1"
            >
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 py-2 flex items-center text-gray-600"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="member_title"
              className="block text-sm font-medium mb-1"
            >
              คำนำหน้า
            </label>
            <input
              type="text"
              id="member_title"
              name="member_title"
              value={formData.member_title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="member_name"
              className="block text-sm font-medium mb-1"
            >
              ชื่อ
            </label>
            <input
              type="text"
              id="member_name"
              name="member_name"
              value={formData.member_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="member_lastname"
              className="block text-sm font-medium mb-1"
            >
              นามสกุล
            </label>
            <input
              type="text"
              id="member_lastname"
              name="member_lastname"
              value={formData.member_lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="member_email"
              className="block text-sm font-medium mb-1"
            >
              อีเมล
            </label>
            <input
              type="email"
              id="member_email"
              name="member_email"
              value={formData.member_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium mb-1"
            >
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              maxLength={10}
            />
          </div>

          <div>
            <label htmlFor="faculity" className="block text-sm font-medium mb-1">
              คณะ
            </label>
            <input
              type="text"
              id="faculity"
              name="faculity"
              value={formData.faculity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium mb-1">
              สาขา
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded"
          >
            ลงทะเบียน
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
