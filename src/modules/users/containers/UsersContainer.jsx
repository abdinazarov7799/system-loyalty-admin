import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Checkbox, Input, Modal, Pagination, Row, Select, Space, Switch, Table} from "antd";
import {get, isEmpty, isNil} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import {PlusOutlined} from "@ant-design/icons";
import GivePoint from "../components/GivePoint.jsx";
import config from "../../../config.js";

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);
    const [searchKey,setSearchKey] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [type, setType] = useState(null);
    const [isMaster, setIsMaster] = useState(null);
    const [isBlocked, setIsBlocked] = useState(null);
    const [pointSort, setPointSort] = useState(null);
    const [levelSort, setLevelSort] = useState(null);
    const [orderSumSort, setOrderSumSort] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.users_get_all,
        url: URLS.users_get_all,
        params: {
            params: {
                size,
                masterPhoneNumber: searchKey,
                type,
                isMaster,
                isBlocked,
                pointSort,
                levelSort,
                orderSumSort
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
                    setIsOpen(true)
                }} />
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => {
                            setSelected(null)
                            setIsOpen(true)
                        }}
                    >
                        {t("Give point all")}
                    </Button>

                    <Input.Search
                        placeholder={t("Phone number")}
                        onChange={(e) => setSearchKey(isEmpty(e.target.value) ? null : e.target.value)}
                        allowClear
                    />

                    <Select
                        options={config.USER_TYPES?.map(type => ({label: type, value: type}))}
                        value={type}
                        placeholder={t("Type")}
                        style={{ width: 150 }}
                        allowClear
                        onSelect={(type) => setType(type)}
                        onClear={() => setType(null)}
                    />

                    <Checkbox
                        onChange={(e) => setIsMaster(e.target.checked ? true : null)}
                        checked={!isNil(isMaster)}
                    >
                        {t("is Master")}
                    </Checkbox>

                    <Checkbox
                        onChange={(e) => setIsBlocked(e.target.checked ? true : null)}
                        checked={!isNil(isBlocked)}
                    >
                        {t("is Blocked")}
                    </Checkbox>

                    <Select
                        options={config.SORTS?.map(type => ({label: type, value: type}))}
                        value={pointSort}
                        placeholder={t("Point sort")}
                        style={{ width: 150 }}
                        allowClear
                        onSelect={(value) => setPointSort(value)}
                        onClear={() => setPointSort(null)}
                    />

                    <Select
                        options={config.SORTS?.map(type => ({label: type, value: type}))}
                        value={levelSort}
                        placeholder={t("Level sort")}
                        style={{ width: 150 }}
                        allowClear
                        onSelect={(value) => setLevelSort(value)}
                        onClear={() => setLevelSort(null)}
                    />
                    <Select
                        options={config.SORTS?.map(type => ({label: type, value: type}))}
                        value={orderSumSort}
                        placeholder={t("Order sum sort")}
                        style={{ width: 150 }}
                        allowClear
                        onSelect={(type) => setOrderSumSort(type)}
                        onClear={() => setOrderSumSort(null)}
                    />
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
                footer={null}
            >
                <GivePoint selected={selected} setSelected={setSelected} setIsOpen={setIsOpen} />
            </Modal>
        </Container>
    );
};

export default UsersContainer;
