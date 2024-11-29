import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, InputNumber} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const CreateEditProduct = ({itemData,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.prizes_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.prizes_list,
        hideSuccessToast: false
    });

    useEffect(() => {
        form.setFieldsValue({
            name: get(itemData,'name'),
            point: get(itemData,'point'),
        });
    }, [itemData]);

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: `${URLS.prize_edit}/${get(itemData,'id')}`, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.prize_add, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
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
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditProduct;
