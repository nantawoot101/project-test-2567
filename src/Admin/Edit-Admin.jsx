import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditAdmin = () => {
  const { admin_id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    admin_title: "",
    admin_name: "",
    admin_lastn: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/admin/getAllById/${admin_id}` // แก้ไขเป็น admin_id
        );
        setFormData(response.data); // อัพเดท formData ด้วยข้อมูลของ admin
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์");
      }
    };

    if (admin_id) fetchProfile();
  }, [admin_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password; // ลบ password ถ้าไม่มีค่า
    }

    try {
      const response = await axios.put(
        `http://localhost:9999/admin/update`, // แก้ไข URL ให้ตรงกับการอัพเดต admin
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "สำเร็จ",
        text: response.data.msg,
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      setError("");
      setSuccess(response.data.msg);

      const updatedAdmin = {
        ...formData,
        admin_id: formData.admin_id,
      };
      sessionStorage.setItem("admin", JSON.stringify(updatedAdmin));

      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.error || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      setSuccess("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 pl-72">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลโปรไฟล์แอดมิน</h2>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin_title"
                className="block text-sm font-medium mb-1"
              >
                คำนำหน้า
              </label>
              <input
                type="text"
                id="admin_title"
                name="admin_title"
                value={formData.admin_title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label
                htmlFor="admin_name"
                className="block text-sm font-medium mb-1"
              >
                ชื่อ
              </label>
              <input
                type="text"
                id="admin_name"
                name="admin_name"
                value={formData.admin_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label
                htmlFor="admin_lastn"
                className="block text-sm font-medium mb-1"
              >
                นามสกุล
              </label>
              <input
                type="text"
                id="admin_lastn"
                name="admin_lastn"
                value={formData.admin_lastn}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
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
                <div className="mt-2">
              <Link 
                to={`/new-password-admin/${formData.admin_id}`}
                className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                เปลี่ยนรหัสผ่าน
              </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
