import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Row, Space, Switch, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {PlusOutlined} from "@ant-design/icons";
import GivePoint from "../components/GivePoint.jsx";

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchKey,setSearchKey] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.users_get_all,
        url: URLS.users_get_all,
        params: {
            params: {
                size,
                masterPhoneNumber: searchKey
            }
        },
        page
    });

    const {mutate: mutateMaster, isLoading: isLoadingMaster} = usePutQuery({
        listKeyId: KEYS.users_get_all
    })
    const {mutate: mutateBlock,isLoading:isLoadingBlock} = usePutQuery({
        listKeyId: KEYS.users_get_all
    })

    const handleMaster = (id,isMaster) => {
        mutateMaster({
            url: `${URLS.users_master}/${id}?master=${isMaster}`,
        })
    }
    const handleBlock = (id,isBlock) => {
        mutateBlock({
            url: `${URLS.users_block}/${id}?block=${isBlock}`,
        })
    }
    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Type"),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Master phone number"),
            dataIndex: "masterPhoneNumber",
            key: "masterPhoneNumber",
        },
        {
            title: t("Chat id"),
            dataIndex: "chatId",
            key: "chatId",
        },
        {
            title: t("Level"),
            dataIndex: "level",
            key: "level",
        },
        {
            title: t("Poinsts"),
            dataIndex: "points",
            key: "points",
        },
        {
            title: t("Order sum"),
            dataIndex: "orderSum",
            key: "orderSum",
        },
        {
            title: t("Master"),
            dataIndex: "master",
            key: "master",
            render: (props,data) => (
                <Switch
                    onChange={(e) => handleMaster(get(data,'id'),e)}
                    checked={get(data,'master')}
                    loading={isLoadingMaster}
                />
            )
        },
        {
            title: t("Blocked"),
            dataIndex: "blocked",
            key: "blocked",
            render: (props,data) => (
                <Switch
                    onChange={(e) => handleBlock(get(data,'id'),e)}
                    checked={get(data,'blocked')}
                    loading={isLoadingBlock}
                />
            )
        },
        {
            title: t("Give point"),
            dataIndex: "point",
            key: "point",
            render: (props,data) => (
                <Button icon={<PlusOutlined />} onClick={() => {
                    setSelected(data)
                }} />
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Master phone number")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
                    />

                    <Button icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
                        {t("Give point all")}
                    </Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
            <Modal
                title={`Give point ${!selected ? "all" : `${get(selected,'chatId')}`}`}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
            >
                <GivePoint selected={selected} setSelected={setSelected} setIsOpen={setIsOpen} />
            </Modal>
        </Container>
    );
};

export default UsersContainer;
