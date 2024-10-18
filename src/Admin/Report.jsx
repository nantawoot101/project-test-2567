import { useState, useEffect } from "react";
import axios from "axios";

const Report = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState(""); 
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    school_year: "", // ค่าเริ่มต้นสำหรับปีการจัดทำ
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const projectResponse = await axios.get(
          `http://localhost:9999/project/getAll`
        );
        const creatorResponse = await axios.get(
          `http://localhost:9999/creator/getAll`
        );
        const expertResponse = await axios.get('http://localhost:9999/expert/getAll');
        const advisorResponse = await axios.get('http://localhost:9999/advisor/getAll');
        const chairmanResponse = await axios.get('http://localhost:9999/chairman/getAll');
  
        const creatorsByProject = creatorResponse.data.reduce(
          (acc, creator) => {
            if (!acc[creator.id_project]) {
              acc[creator.id_project] = {
                names: [],
                ids: [],
              };
            }
            acc[creator.id_project].names.push(creator.creator);
            acc[creator.id_project].ids.push(creator.id_student);
            return acc;
          },
          {}
        );
  
        const expertsById = expertResponse.data.reduce((acc, expert) => {
          const combinedInfo = `${expert.expert_title}${expert.expert_name} ${expert.expert_lastname}`;
          acc[expert.id_expert] = combinedInfo;
          return acc;
        }, {});

        const chairmanById = chairmanResponse.data.reduce((acc, chairman) => {
          const combinedInfo = `${chairman.chairman_title}${chairman.chairman_name} ${chairman.chairman_lastname}`;
          acc[chairman.id_chairman] = combinedInfo;
          return acc;
        }, {});
        
        const advisorById = advisorResponse.data.reduce((acc, advisor) => {
          const combinedInfo = `${advisor.advisor_title}${advisor.advisor_name} ${advisor.advisor_lastname}`;
          acc[advisor.id_advisor] = combinedInfo;
          return acc;
        }, {});
        
        const mergedData = projectResponse.data.map((project) => {
          const projectCreators = creatorsByProject[project.id_project] || {
            names: [],
            ids: [],
          };
          
          return {
            ...project,
            creators: projectCreators.names.join("<br />"),
            id_students: projectCreators.ids.join("<br />"),
            expert: expertsById[project.id_expert] || '', 
            advisor: advisorById[project.id_advisor] || '', 
            chairman: chairmanById[project.id_chairman] || '', 
          };
        });
        
        setProjects(mergedData);
        setFilteredProjects(mergedData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const fetchTypeReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await axios.get(
            `http://localhost:9999/project/report/type`,
            {
                params: {
                    type: reportType || '', 
                    year: searchCriteria.school_year || '', // ส่งปีที่เลือกเป็นพารามิเตอร์
                },
                responseType: "blob", 
            }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `รายงานโปรเจค_${reportType || 'ทั้งหมด'}_${searchCriteria.school_year || 'ทุกปี'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading report:", error);
        setError("ไม่สามารถดาวน์โหลดรายงานได้");
    } finally {
        setIsLoading(false);
    }
  };

  const filterProjectsByCriteria = () => {
    let filtered = projects;

    if (reportType) {
      filtered = filtered.filter(project => project.development_type === reportType);
    }

    if (searchCriteria.school_year) {
      filtered = filtered.filter(project => project.school_year === searchCriteria.school_year);
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjectsByCriteria();
  }, [reportType, searchCriteria, projects]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pl-72">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out w-full lg:w-1/2">
          <h2 className="text-xl font-bold mb-4">เลือกประเภทของรายงาน</h2>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          >
            <option value="">ดาวน์โหลดโปรเจคทั้งหมด</option>
            <option value="การพัฒนาเว็บ">การพัฒนาเว็บ</option>
            <option value="การพัฒนาแอปมือถือ">การพัฒนาแอปมือถือ</option>
            <option value="การพัฒนาซอฟต์แวร์">การพัฒนาซอฟต์แวร์</option>
            <option value="การวิเคราะห์ข้อมูล">การวิเคราะห์ข้อมูล</option>
            <option value="การพัฒนา AI">การพัฒนา AI</option>
          </select>
          <button
            onClick={fetchTypeReport}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ease-in-out flex items-center"
            disabled={isLoading}
          >
            {isLoading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลดรายงาน"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>

      <div className="my-4">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="school_year"
        >
          ปีที่จัดทำ
        </label>
        <select
          name="school_year"
          value={searchCriteria.school_year}
          onChange={handleSearchChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">ปีทั้งหมด</option>
          <option value="2566">2566</option>
          <option value="2567">2567</option>
        </select>
      </div>

      <div>
        <table className="min-w-full mt-6 bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ลำดับ</th>
              <th className="py-2 px-4 border-b">ชื่อโครงงาน</th>
              <th className="py-2 px-4 border-b">ผู้แต่ง</th>
              <th className="py-2 px-4 border-b">รหัสนักศึกษา</th>
              <th className="py-2 px-4 border-b">ที่ปรึกษาโครงงาน</th>
              <th className="py-2 px-4 border-b">ประธาน</th>
              <th className="py-2 px-4 border-b">ผู้ทรงคุณวุฒิ</th>
              <th className="py-2 px-4 border-b">ปีที่จัดทำ</th>
              <th className="py-2 px-4 border-b">ประเภทการพัฒนา</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <tr key={project.id_project}>
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{project.project_title}</td>
                  <td className="py-2 px-4 border-b">
                    <div dangerouslySetInnerHTML={{ __html: project.creators }} />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div dangerouslySetInnerHTML={{ __html: project.id_students }} />
                  </td>
                  <td className="py-2 px-4 border-b">{project.advisor}</td>
                  <td className="py-2 px-4 border-b">{project.chairman}</td>
                  <td className="py-2 px-4 border-b">{project.expert}</td>
                  <td className="py-2 px-4 border-b">{project.school_year}</td>
                  <td className="py-2 px-4 border-b">{project.development_type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center" colSpan={9}>
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
