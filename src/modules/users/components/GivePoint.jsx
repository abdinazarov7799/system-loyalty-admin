import React from 'react';
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {KEYS} from "../../../constants/key.js";
import {Button, Form, Input, InputNumber} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";

const GivePoint = ({selected,setSelected,setIsOpen}) => {
    const {t} = useTranslation();

    const {mutate,isLoading} = usePutQuery({
        listKeyId: KEYS.users_get_all
    })
    const onFinish = (values) => {
        if (!selected) {
            mutate(
                { url: `/api/points`, attributes: values },
                {
                    onSuccess: () => {
                        setIsOpen(false);
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
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label={t("Cause")}
                    name={"cause"}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Give")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default GivePoint;
