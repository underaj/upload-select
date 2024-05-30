import React from "react";
import Cookies from "js-cookie";
import { Table, Input, Upload, message, Button, Modal } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "./App.css";

const { Dragger } = Upload;

const props = {
  name: "file",
  multiple: false,
  action: "/api/zhongan/uploadfile",
  maxCount: 1,
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const columns = [
  {
    title: "Policy ID",
    dataIndex: "policyId",
    width: 100,
  },
  {
    title: "客户姓名",
    dataIndex: "holderName",
  },
  {
    title: "客户证件号",
    dataIndex: "holderCertNo",
  },
  {
    title: "产品名称",
    dataIndex: "productFullName",
  },
  {
    title: "Agent 姓名",
    dataIndex: "agentName",
  },
  {
    title: "签发时间",
    dataIndex: "issueTime",
  },
  {
    title: "PDF文档名称",
    dataIndex: "pdfFilename",
  },
  // {
  //   title: "PDF文档位置",
  //   dataIndex: "pdfFilepath",
  // },
];

const dataaaa = [];

for (var i = 0; i < 100; i++) {
  dataaaa.push({
    rowkey: i,
    policyId: 166020,
    holderName: "卢洁",
    holderCertNo: "411481198706270349",
    productFullName: null,
    agentName: "卢洁",
    issueTime: "2024-05-16",
    pdfFilename: "APL1780906354069233664客户告知书.pdf",
    pdfFilepath:
      "/root/better/temp/UploadPDFToZhongAn/APL1780906354069233664客户告知书.pdf",
  });
}

const App = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [data, setData] = React.useState(dataaaa);

  const closeModal = () => {
    setShowModal(false);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const storeTokenValue = (e) => {
    const value = e.target.value;
    setToken(value);
    localStorage.setItem("token", value);
    Cookies.set("zhongan-token", value, { expires: 86400, secure: true });
  };

  const onChange = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      if (info.file.response && info.file.response.data) {
        setData(
          info.file.response.data.map((item, i) => {
            return { rowkey: i, ...item };
          })
        );
      }
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  return (
    <div className="App">
      <p className="fieldTitle">Zhongan Token</p>
      <Input
        style={{ width: 400, marginBottom: 28 }}
        onChange={storeTokenValue}
        placeholder="Input token"
        value={token}
      ></Input>
      <Dragger
        {...props}
        withCredentials={true}
        style={{ maxWidth: 800 }}
        onChange={onChange}
        // headers={{ "zhongan-token": token }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或将文件拖到此区域进行分析</p>
        <p className="ant-upload-hint">
          仅支持单次上传。严禁上传公司数据或其他违禁文件。
        </p>
      </Dragger>
      <Button
        onClick={() => setShowModal(true)}
        disabled={data.length === 0}
        style={{ marginTop: 24, width: 800 }}
        type="primary"
      >
        选择数据并上传
      </Button>
      <Modal
        title="选择入档资料"
        width={1200}
        centered
        open={showModal}
        onCancel={closeModal}
        cancelText="取消"
        okText="存档"
      >
        <div
          style={{ margin: "24px 0", maxHeight: "80vh", overflowX: "scroll" }}
        >
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            sticky
            rowKey="rowkey"
            pagination={{
              total: data.length,
              pageSize: 20,
              pageSizeOptions: [20],
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default App;
