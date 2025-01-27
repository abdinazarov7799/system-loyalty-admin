import React, {useEffect} from 'react';
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input} from "antd";
import {useTranslation} from "react-i18next";
import {get, isEqual} from "lodash";

const EditConstants = ({selected,setSelected}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();

    const {mutate,isLoading} = usePutQuery({
        listKeyId: KEYS.constants_get_all
    })
    const onFinish = (values) => {
        const formData = {
            ...values,
        }
        mutate(
            { url: `${URLS.constants_edit}/${get(selected,'id')}`, attributes: formData },
            {
                onSuccess: () => {
                    setSelected(null);
                },
            }
        );
    };

    useEffect(() => {
        form.setFieldsValue({
            key: get(selected,'key'),
            value: get(selected,'value'),
        });
    }, [selected]);

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("Key")}
                    name={"key"}
                >
                    <Input disabled={true} />
                </Form.Item>

                <Form.Item
                    label={t("Value")}
                    name={"value"}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Edit")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditConstants;
