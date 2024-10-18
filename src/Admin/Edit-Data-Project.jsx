import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

function EditDataProject() {
  const [projectTitle, setProjectTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [developmentType, setDevelopmentType] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [schoolYears, setSchoolYears] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [memberId, setMemberId] = useState("");
  const [chairman, setChairman] = useState("");
  const [expert, setExpert] = useState(""); // Store id_expert
  const [project, setProject] = useState({
    project_title: "",
    development_type: "",
    id_advisor: "",
    school_year: "",
    id_chairman: "",
    id_expert: "",
  });
  const [creators, setCreators] = useState([{ creator: "", id_student: "" }]);
  const [documents, setDocuments] = useState([]);
  const [docId, setDocId] = useState(""); // State for document ID
  const [experts, setExperts] = useState([]); // State for experts
  const [chairmans, setChairmans] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  const { id_project } = useParams();


  const developmentTypes = [
    "การพัฒนาเว็บ",
    "การพัฒนาแอปมือถือ",
    "การพัฒนาซอฟต์แวร์",
    "การวิเคราะห์ข้อมูล",
    "การพัฒนา AI",
  ];

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.member_id) {
        setMemberId(user.member_id.toString());
      }
    }

    const currentYear = new Date().getFullYear() + 543; // Adjust year to Buddhist Era
    const startYear = 2566;
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    setSchoolYears(years);

    const fetchData = async () => {
      try {
        // Fetch project data
        if (id_project) {
          const projectResponse = await axios.get(
            `http://localhost:9999/project/getById/${id_project}`
          );
          setProject(projectResponse.data);
          setProjectTitle(projectResponse.data.project_title || "");
          setDevelopmentType(projectResponse.data.development_type || "");
          setAdvisor(projectResponse.data.id_advisor || "");
          setSchoolYear(projectResponse.data.school_year || "");
          setChairman(projectResponse.data.id_chairman || "");
          setExpert(projectResponse.data.id_expert || "");

          // Fetch creators related to the project
          const creatorsResponse = await axios.get(
            `http://localhost:9999/creator/product/${id_project}`
          );
          setCreators(
            creatorsResponse.data || [{ creator: "", id_student: "" }]
          );

          // Fetch documents related to the project
          const documentsResponse = await axios.get(
            `http://localhost:9999/docs/getById/${id_project}`
          );
          setDocuments(documentsResponse.data.data || []);
          // Set docId from the first document if available
          if (documentsResponse.data.data.length > 0) {
            setDocId(documentsResponse.data.data[0].id); // Set document ID
          }
        }

        const expertsResponse = await axios.get(
          'http://localhost:9999/expert/getAll'
        );
        setExperts(expertsResponse.data || []);

        const advisorResponse = await axios.get(
          'http://localhost:9999/advisor/getAll'
        );
        setAdvisors(advisorResponse.data || []);

        const chairmanResponse = await axios.get(
          'http://localhost:9999/chairman/getAll'
        );
        setChairmans(chairmanResponse.data || []);

      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: "ไม่สามารถดึงข้อมูลโปรเจกต์ได้",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    };
    
      

    fetchData();
  }, [id_project]);

  const handleCreatorChange = (index, field, value) => {
    const updatedCreators = creators.map((creator, i) =>
      i === index ? { ...creator, [field]: value } : creator
    );
    setCreators(updatedCreators);
  };

  const handleRemoveDocument = (docId) => {
    // Instead of sending delete request, just filter out the document from state
    setDocuments(documents.filter((doc) => doc.id !== docId));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
  
    try {
      const projectData = {
        id_project: id_project,
        project_title: projectTitle,
        development_type: developmentType,
        id_advisor: advisor,
        school_year: schoolYear,
        id_chairman: chairman,
        id_expert: expert,
      };
  
      const filteredProjectData = Object.fromEntries(
        Object.entries(projectData).filter(([key, value]) => value)
      );
  
      if (Object.keys(filteredProjectData).length > 0) {
        await axios.put(
          `http://localhost:9999/project/update`,
          filteredProjectData
        );
      }
  
      for (const creatorData of creators) {
        if (creatorData.creator || creatorData.id_student) {
          if (!creatorData.id_student) {
            throw new Error("กรุณากรอก ID ของผู้สร้างโครงการ");
          }
          await axios.put("http://localhost:9999/creator/update", creatorData);
        }
      }
  
      if (files.length > 0) {
        if (!docId) {
          throw new Error("Document ID is missing");
        }
  
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("id", docId);
        formData.append("id_project", id_project);
        formData.append("name_project", projectTitle);
  
        await axios.put("http://localhost:9999/docs/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      Swal.fire({
        title: "สำเร็จ!",
        text: "โปรเจกต์ถูกอัปเดตแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      }).then(() => {
        window.location.href = `/manage-project-admin`;
      });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        title: "ข้อผิดพลาด!",
        text: error.response
          ? error.response.data.error
          : "การส่งข้อมูลล้มเหลว",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      setErrorMessage("การส่งข้อมูลล้มเหลว");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="min-h-screen p-6 pl-72 bg-gray-100">
      <main className="mt-8 container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">แก้ไขโครงงาน</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <label htmlFor="projectTitle" className="block text-lg font-medium text-gray-700">
              ชื่อโครงงาน
            </label>
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="developmentType" className="block text-lg font-medium text-gray-700">
              ประเภทการพัฒนา
            </label>
            <select
              id="developmentType"
              value={developmentType}
              onChange={(e) => setDevelopmentType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">เลือกประเภทการพัฒนา</option>
              {developmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="advisor" className="block text-gray-700">อาจารย์ที่ปรึกษา</label>
            <select
              id="advisor"
              value={advisor}
              onChange={(e) => setAdvisor(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">เลือกอาจารย์ที่ปรึกษา</option>
              {advisors.map((advisor) => (
                <option key={advisor.id_advisor} value={advisor.id_advisor}>{advisor.advisor_title}{advisor.advisor_name} {advisor.advisor_lastname}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="chairman" className="block text-gray-700">ประธาน</label>
            <select
              id="chairman"
              value={chairman}
              onChange={(e) => setChairman(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">เลือกประธาน</option>
              {chairmans.map((chairman) => (
                <option key={chairman.id_chairman} value={chairman.id_chairman}>{chairman.chairman_title}{chairman.chairman_name} {chairman.chairman_lastname}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="expert" className="block text-gray-700">
              ผู้ทรงคุณวุฒิ
            </label>
            <select
              id="expert"
              name="expert"
              value={expert}
              onChange={(e) => setExpert(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">เลือกผู้ทรงคุณวุฒิ</option>
              {experts.map((exp) => (
                <option key={exp.id_expert} value={exp.id_expert}>
                  {exp.expert_title}{exp.expert_name} {exp.expert_lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="schoolYear" className="block text-lg font-medium text-gray-700">
              ปีการศึกษา
            </label>
            <select
              id="schoolYear"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">เลือกปีการศึกษา</option>
              {schoolYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {creators.map((creator, index) => (
            <div key={index} className="space-y-4">
              <div>
                <label htmlFor={`creator-${index}`} className="block text-lg font-medium text-gray-700">
                  ชื่อผู้สร้างโครงการ
                </label>
                <input
                  type="text"
                  id={`creator-${index}`}
                  value={creator.creator}
                  onChange={(e) => handleCreatorChange(index, "creator", e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor={`id_student-${index}`} className="block text-lg font-medium text-gray-700">
                  รหัสของนักศึกษา
                </label>
                <input
                  type="text"
                  id={`id_student-${index}`}
                  value={creator.id_student}
                  onChange={(e) => handleCreatorChange(index, "id_student", e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          ))}
          
          <div>
            <label htmlFor="file" className="block text-lg font-medium text-gray-700">
              เลือกไฟล์
            </label>
            <input
              type="file"
              id="file"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="documents"
              className="block text-lg font-medium text-gray-700"
            >
              เอกสารที่อัปโหลด
            </label>
            <ul className="mt-1 space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
                >
                  <a
                    href={`http://localhost:9999/files/${doc.name_file}`}
                    className="text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.name_file}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ลบ
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSubmitting ? "กำลังส่ง..." : "อัปเดต"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditDataProject;
