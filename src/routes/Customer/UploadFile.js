import { Button } from "antd"
import {PlusOutlined} from '@ant-design/icons';

const UploadFile = () => {
    return (
        <Button icon={<PlusOutlined />}>
            <input id="files" type="file" />
        </Button>
    )
}

export default UploadFile