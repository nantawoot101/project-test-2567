import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function NewPassword() {
  const { member_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Fetch profile data when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/auth/getAllById/${member_id}`);
        setFormData({
          ...formData,
          currentPassword: response.data.currentPassword || "",
        });
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์");
      }
    };

    fetchProfile();
  }, [member_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    // ตรวจสอบว่ารหัสผ่านใหม่และยืนยันรหัสผ่านตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    // รีเซ็ตข้อความ error
    setError("");

    try {
      // แสดง SweetAlert2 สำหรับการยืนยัน
      const result = await Swal.fire({
        title: "ยืนยันการเปลี่ยนรหัสผ่าน",
        text: "คุณแน่ใจว่าต้องการเปลี่ยนรหัสผ่านนี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        // เรียก API เพื่อเปลี่ยนรหัสผ่าน
        await axios.put("http://localhost:9999/auth/password", {
          member_id: member_id,
          password_id: newPassword,
        });

        // แสดง SweetAlert2 เมื่อเปลี่ยนรหัสผ่านสำเร็จ
        await Swal.fire({
          title: "สำเร็จ",
          text: "เปลี่ยนรหัสผ่านสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });

        // รีเซ็ตฟอร์มหลังจากเปลี่ยนรหัสผ่านสำเร็จ
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // ไปยังหน้า '/edit-user/:member_id'
        navigate(`/profile/${member_id}`);
      } else {
        // ถ้าผู้ใช้ยกเลิกการเปลี่ยนรหัสผ่าน
        Swal.fire({
          title: "ยกเลิก",
          text: "การเปลี่ยนรหัสผ่านถูกยกเลิก",
          icon: "info",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">เปลี่ยนรหัสผ่าน</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              รหัสผ่านใหม่
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onClick={() => setShowPassword(!showPassword)}
              />
              <span className="ml-2">แสดงรหัสผ่าน</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
