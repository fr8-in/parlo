import { useState } from "react";
import { Button, message, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";




interface Props {
  folder: string;
  file_type: string;
  file_list: any;
  disable?: boolean;
}

const FilePreview = (props: Props) => {
  const { folder, file_type, file_list, disable } = props;
  const file =
    file_list && file_list.length > 0 ? file_list[0].file_path : null;
  const previewInitial = { visible: false, image: "", title: "", ext: "" };
  const [preview, setPreview] = useState(previewInitial);

  

  const handleCancel = () => setPreview(previewInitial);

  const onPreview = (file:any) => {
    if (!file) {
      message.error(`There is NO ${file_type} file to View!!`);
    } else {
      const ext = file.split(/[\s.]+/);
      setPreview({ ...preview, ext: ext[ext.length - 1] });

      const variables = { name: file, folder: folder };
      
    }
  };

  return (
    <>
      <Button
        shape="circle"
        size="middle"
        disabled={disable}
        icon={<EyeOutlined />}
        onClick={() => onPreview(file)}
      />
      {preview.visible && (
        <Modal
          open={preview.visible}
          title={preview.title}
          footer={null}
          onCancel={handleCancel}
          bodyStyle={{ padding: 10 }}
          style={{ top: 20 }}
          width={800}
        >
          <picture>
            <img
              alt={file_type}
              style={{ width: "100%", zIndex: 1301}}
              src={preview.image}
            />
          </picture>
        </Modal>
      )}
    </>
  );
};

export default FilePreview;
