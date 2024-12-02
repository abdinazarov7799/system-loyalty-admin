import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, InputNumber, message, Upload} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {InboxOutlined} from "@ant-design/icons";
import Resizer from "react-image-file-resizer";
import ImgCrop from "antd-img-crop";
const { Dragger } = Upload;


const CreateEditProduct = ({itemData,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [imageUrl,setImgUrl] = useState(null);

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.prizes_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.prizes_list,
        hideSuccessToast: false
    });

    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });

    useEffect(() => {
        form.setFieldsValue({
            name: get(itemData,'name'),
            point: get(itemData,'point'),
        });
        setImgUrl(get(itemData,'imageUrl'));
    }, [itemData]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            imageUrl
        }
        if (itemData){
            mutateEdit(
                { url: `${URLS.prize_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.prize_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    const resizeFile = (file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                400,
                400,
                "WEBP",
                60,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        })
    };
    const beforeUpload = async (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error(t('Image must smaller than 10MB!'));
            return;
        }
        const uri = await resizeFile(file);
        const resizedImage = await fetch(uri).then(res => res.blob());
        return new Blob([resizedImage],{ type: "webp"});
    };
    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        UploadImage(
            { url: URLS.file_upload, attributes: formData, config: { headers: { 'Content-Type': 'multipart/form-data' } } },
            {
                onSuccess: ({ data }) => {
                    onSuccess(true);
                    setImgUrl(data);
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("Name")}
                    name="name"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Point")}
                    name="point"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.5} aspect={400/400}>
                        <Dragger
                            maxCount={1}
                            multiple={false}
                            accept={".jpg,.png,jpeg,svg"}
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                        </Dragger>
                    </ImgCrop>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditProduct;
