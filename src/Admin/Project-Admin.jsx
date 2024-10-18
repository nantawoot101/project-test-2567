import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProjectAdmin() {
  const { id_project } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [viewDownloads, setViewDownloads] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axios.get(
          `http://localhost:9999/project/getById/${id_project}`
        );
        const projectData = projectResponse.data;
  
        // If the user is authenticated, fetch document details
        let documentsResponse = { data: { data: [] } };
        if (isAuthenticated) {
          documentsResponse = await axios.get(
            `http://localhost:9999/docs/getById/${id_project}`
          );
          setDocuments(documentsResponse.data.data || []);
        }
  
        const [
          creatorResponse,
          expertResponse,
          viewResponse,
          advisorResponse,
          chairmanResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:9999/creator/getAll`),
          axios.get(`http://localhost:9999/expert/getAll`),
          axios.get(`http://localhost:9999/view/project/${id_project}`),
          axios.get("http://localhost:9999/advisor/getAll"),
          axios.get("http://localhost:9999/chairman/getAll"),
        ]);
  
        // Data processing and view count calculation
        const clickCount = viewResponse.data[0]?.clickCount || 0;
        const calculatedViews = Math.floor(clickCount / 5);
        setViews(calculatedViews);
  
        const creatorsData = creatorResponse.data;
        const creatorsByProject = creatorsData.reduce((acc, creator) => {
          if (!acc[creator.id_project]) {
            acc[creator.id_project] = [];
          }
          acc[creator.id_project].push({
            name: creator.creator,
            id: creator.id_student,
          });
          return acc;
        }, {});
  
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
  
        // Adding all details to the project data
        const creatorsList = creatorsByProject[projectData.id_project] || [];
        const projectExpertName = expertsById[projectData.id_expert] || "";
        const projectChairmanName = chairmanById[projectData.id_chairman] || "";
        const projectAdvisorName = advisorById[projectData.id_advisor] || "";
  
        const projectWithCreators = {
          ...projectData,
          creators: creatorsList,
          expert: projectExpertName,
          chairman: projectChairmanName,
          advisor: projectAdvisorName,
        };
  
        setProject(projectWithCreators);
  
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProjectDetails();
  }, [id_project, isAuthenticated]);
  

  useEffect(() => {
    if (documents.length > 0) {
      const fetchDocumentDownloads = async () => {
        try {
          const viewDownloadsData = {};

          // ดึงข้อมูลดาวน์โหลดสำหรับเอกสารแต่ละตัว
          await Promise.all(
            documents.map(async (doc) => {
              const docId = doc.id; // ใช้ doc.id แทน doc.id_doc

              if (!docId) {
                console.warn("Document ID is undefined:", doc);
                return;
              }

              try {
                const response = await axios.get(
                  `http://localhost:9999/dowload/getById/${docId}`
                );
                console.log("Document download info:", response.data); // ตรวจสอบข้อมูลที่ได้รับ
                const { totalDownloads } = response.data;
                viewDownloadsData[docId] = totalDownloads || 0;
              } catch (error) {
                console.error(
                  "Error fetching download count for doc:",
                  error.response ? error.response.data : error.message
                );
              }
            })
          );

          setViewDownloads(viewDownloadsData);
        } catch (err) {
          console.error("Error fetching download details:", err);
        }
      };

      fetchDocumentDownloads();
    }
  }, [documents]);

  const recordDownload = async (docId) => {
    try {
      await axios.post("http://localhost:9999/dowload/save", { id_doc: docId });
      console.log("Download recorded successfully");
    } catch (error) {
      console.error(
        "Error recording download:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500">กำลังโหลด...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        ข้อผิดพลาดในการโหลดรายละเอียดโครงการ: {error.message}
      </p>
    );

  return (
    <div className="p-6 pl-72 bg-gradient-to-r from-blue-50 to-white min-h-screen">
      <main className="container mx-auto mt-8 max-w-4xl">
        {project ? (
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl">
            <h1 className="text-4xl font-bold mb-6 text-blue-800 decoration-wavy transition-all duration-300 hover:text-blue-600">
              {project.project_title}
            </h1>

            <div className="flex items-center space-x-2">
              <i className="fas fa-eye text-blue-500 text-2xl"></i>
              <p className="text-lg font-semibold text-gray-700">
                ผู้เข้าชม: {views}
              </p>
            </div>

            <div className="mt-5">
              <strong className="text-lg text-gray-700">ผู้จัดทำ:</strong>
              {project.creators.map((creator, index) => (
                <p
                  key={creator.id}
                  className="text-lg text-gray-800 transition-all duration-300 hover:text-gray-600"
                >
                  {index + 1}. {creator.name} ({creator.id})
                </p>
              ))}
            </div>

            <p className="text-lg text-gray-800">
              <strong className="text-lg text-gray-700">
                ที่ปรึกษาโครงงาน:
              </strong>{" "}
              {project.advisor}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="text-lg text-gray-700">ประธาน:</strong>{" "}
              {project.chairman}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="text-lg text-gray-700">ผู้ทรงคุณวุฒิ:</strong>{" "}
              {project.expert}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="text-lg text-gray-700">ประเภทการพัฒนา:</strong>{" "}
              {project.development_type}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="text-lg text-gray-700">ปีที่จัดทำ:</strong>{" "}
              {project.school_year}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">ไม่มีข้อมูลโครงการ</p>
        )}

        <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-800 flex items-center">
          <i className="fa-solid fa-file-alt fa-icon mr-2"></i>{" "}
          เอกสารที่เกี่ยวข้อง
        </h2>
        {isAuthenticated ? (
          <>
            {documents.length === 0 ? (
              <p className="text-center text-gray-500">ไม่พบเอกสาร</p>
            ) : (
              <ul className="space-y-4">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="relative flex justify-between items-center transition-all duration-300 hover:bg-blue-50 hover:shadow-md p-4 rounded-lg border border-gray-200"
                  >
                    <a
                      href={doc.file_url}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-3 truncate w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordDownload(doc.id)} // เรียกใช้ recordDownload ที่นี่
                    >
                      <i className="fa-solid fa-file-pdf fa-icon text-red-600"></i>
                      <span className="truncate">{doc.name_file}</span>
                    </a>
                    <a
                      href={`http://localhost:9999/docs/download/${doc.name_file}`}
                      className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                      download
                      onClick={() => recordDownload(doc.id)} // เรียกใช้ recordDownload ที่นี่
                    >
                      ดาวน์โหลด
                    </a>
                    <span className="ml-4 text-gray-600">
                      {viewDownloads[doc.id] || 0} ดาวน์โหลด
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">
            กรุณาเข้าสู่ระบบเพื่อดูเอกสาร
          </p>
        )}
      </main>
    </div>
  );
}

export default ProjectAdmin;
