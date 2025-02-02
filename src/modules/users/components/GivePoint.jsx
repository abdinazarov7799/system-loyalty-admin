import React from 'react';
import {KEYS} from "../../../constants/key.js";
import {Button, Form, Input, InputNumber} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";
import usePostQuery from "../../../hooks/api/usePostQuery.js";

const GivePoint = ({selected,setSelected,setIsOpen}) => {
    const {t} = useTranslation();

    const {mutate,isLoading} = usePostQuery({
        listKeyId: KEYS.users_get_all
    })
    const onFinish = (values) => {
        if (!selected) {
            mutate(
                { url: `/api/points`, attributes: values },
                {
                    onSuccess: () => {
                        setIsOpen(false);
                        setSelected(null);
                    },
                }
            );
        }else {
            mutate(
                { url: `/api/points/${get(selected,'chatId')}`, attributes: values },
                {
                    onSuccess: () => {
                        setSelected(null);
                        setIsOpen(false);
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
            >
                <Form.Item
                    label={t("Point")}
                    name={"point"}
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width:'100%'}}/>
                </Form.Item>

                <Form.Item
                    label={t("Cause")}
                    name={"cause"}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t(`${!selected ? "Give all" : "Give"}`)}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default GivePoint;
