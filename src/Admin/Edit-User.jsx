import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditUser = () => {
  const { member_id } = useParams();
  const [formData, setFormData] = useState({
    username_id: "",
    password_id: "",
    member_title: "",
    member_name: "",
    member_lastname: "",
    member_email: "",
    faculity: "",
    branch: "",
    Id_student: "",
    phone_number: "",
    role_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await axios.get("http://localhost:9999/role/getAll");
        setRoles(response.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/auth/getAllById/${member_id}`
        );
        console.log('member_id:', member_id);
        setFormData(response.data);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์");
      }
    };

    fetchAllRoles();
    if (member_id) fetchProfile();
  }, [member_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  
    // ลบการใช้ FormData
    const updateData = { ...formData };
    if (!updateData.password_id) {
      delete updateData.password_id; // ลบ password_id ถ้าไม่มีค่า
    }
  
    try {
      // ส่งข้อมูลเป็น JSON
      const response = await axios.put(
        `http://localhost:9999/auth/update`, // ตรวจสอบให้ URL มี member_id ด้วย
        updateData,
        {
          headers: {
            "Content-Type": "application/json", // กำหนด Content-Type เป็น JSON
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
  
      const updatedUser = {
        ...formData,
        member_id: formData.member_id
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
  
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
  

  const getLabelForRole = () => {
    switch (parseInt(formData.role_id, 10)) {
      case 1:
        return "รหัสนักศึกษา";
      case 2:
        return "รหัสอาจารย์";
      default:
        return "ID";
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 pl-72">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลโปรไฟล์</h2>
        {success && <p className="text-green-500">{success}</p>}
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

            <div>
              <label htmlFor="Id_student" className="block text-sm font-medium mb-1">
                {getLabelForRole()}
              </label>
              <input
                type="text"
                id="Id_student"
                name="Id_student"
                value={formData.Id_student}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="username_id" className="block text-sm font-medium mb-1">
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
              <label htmlFor="new_password" className="block text-sm font-medium mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new_password"
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
              <div className="mt-2">
              <Link 
                to={`/new-password-user/${formData.member_id}`}
                className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                เปลี่ยนรหัสผ่าน
              </Link>
            </div>
            </div>

            <div>
              <label htmlFor="member_title" className="block text-sm font-medium mb-1">
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
              <label htmlFor="member_name" className="block text-sm font-medium mb-1">
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
              <label htmlFor="member_lastname" className="block text-sm font-medium mb-1">
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
              <label htmlFor="member_email" className="block text-sm font-medium mb-1">
                อีเมล์
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
              <label htmlFor="faculity" className="block text-sm font-medium mb-1">
                คณะ
              </label>
              <input
                type="text"
                id="faculity"
                name="faculity"
                value={formData.faculity}
                className="w-full px-3 py-2 border rounded "
                
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
                className="w-full px-3 py-2 border rounded "
                
              />
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

export default EditUser;
