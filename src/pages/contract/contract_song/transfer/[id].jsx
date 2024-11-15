import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Input, message, Modal, Row, Select, Spin } from 'antd';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/style/style.less';
import FooterToolbar from '@/components/FooterToolbar';

export const Transfer = props => {
  const {
    loading,
    dispatch,
    contractSongList: { info, transferList, rightSongs },
    match,
  } = props;

  const { confirm } = Modal;
  const [trans, setTrans] = useState({});

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'contractSongList/fetchGetInfo',
      payload: {
        id: match.params.id,
      },
    });
    dispatch({
      type: 'contractSongList/fetchRightSong',
      payload: {
        id: match.params.id,
        page_current: 1,
      },
    });
  };

  const getTransContract = (objectId) => {
    dispatch({
      type: 'contractSongList/fetchGetTransferData',
      payload: {
        party_b_object_id: objectId,
        contract_id: match.params.id,
      },
    });
  };

  // 合約轉換
  const transferContract = (payload) => {
    let apiCheck = true;
    if (rightSongs.total_items > 0) {
      dispatch({
        type: 'songRightsList/fetchTransferContract',
        payload,
        callback: res => {
          if (res && res.status_code === 200) {
            apiCheck = true;
          } else {
            apiCheck = false;
          }
        },
      });
    }
    if (apiCheck === true) {
      dispatch({
        type: 'contractSongList/fetchTransferContract',
        payload: {
          old_contract_id: payload.contract_song_id,
          new_contract_id: payload.new_contract_song_id,
        },
        callback: res2 => {
          if (res2 && res2.data === true) {
            message.success('合約轉換成功');
            history.push(`/contract/contract_song/adv/id/${info.id}`);
          }
        },
      });
    }
  };

  const getOptions = () => {
    const result = [{ value: '0', label: '請選擇合約' }];
    if (transferList) {
      transferList.forEach(row => {
          result.push({
            value: row.id,
            label: row.contract_code,
          });
        },
      );
    }
    return result;
  };

  // mount
  useEffect(() => {
    getData();
  }, [match.params.id]);

  useEffect(() => {
    getTransContract(info.party_b_object ? info.party_b_object.id : undefined);
  }, [info]);

  const submit = () => {
    if (trans.id) {
      confirm({
        title: '',
        icon: '',
        content: `確定要轉換合約嗎？`,
        okText: '確定',
        cancelText: '取消',
        onOk() {
          const payload = {};
          payload.author_code = info.party_b_object ? info.party_b_object.author_code : undefined;
          payload.contract_song_id = info.id;
          payload.contract_song_code = info.contract_code;
          payload.old_contract_agency_end = info.contract_expiry_date;
          payload.new_contract_song_id = trans.id;
          payload.new_contract_song_code = trans.contract_code;
          payload.op_company_id = trans.op_company_id;
          payload.op_author_id = trans.op_author_id;
          payload.sp_company_id = trans.sp_company_id;
          payload.op_company_nickname_id = trans.op_nickname_id;
          payload.sp_company_nickname_id = trans.sp_nickname_id;
          payload.contract_start_date = trans.contract_start_date;
          payload.contract_end_date = trans.contract_end_date;
          payload.early_terminate_date = trans.early_terminate_date;
          payload.contract_agency_end = trans.contract_agency_end;
          payload.authorized_area_type = trans.authorized_area_type;
          payload.authorized_area_id = trans.authorized_area_id;
          payload.type = 'contract';

          transferContract(payload);
        },
        onCancel() {
        },
      });
    } else {
      message.error('請選擇轉換之合約');
    }
  };

  const selectChange = (value) => {
    const transfer = transferList.find(data => value === data.id);
    if (value !== '0') {
      setTrans({
        id: transfer.id,
        contract_code: transfer.contract_code,
        party_b_object_name: transfer.party_b_object_name,
        renewal_period: transfer.renewal_period,
        is_permanent: transfer.is_permanent,
        party_b_company_name: transfer.party_b_company_name,
        contract_termination_date: transfer.contract_termination_date,
        is_transfer: transfer.is_transfer,
        contract_start_date: transfer.contract_start_date,
        authorized_area_name: transfer.authorized_area_name,
        contract_end_date: transfer.contract_end_date,
        contract_agency_end: transfer.contract_agency_end,
        contract_expiry_date: transfer.contract_expiry_date,
        agency_year: transfer.agency_year,
        op_company_id: transfer.op_company_id,
        op_author_id: transfer.op_author_id,
        sp_company_id: transfer.sp_company_id,
        op_nickname_id: transfer.op_nickname_id,
        sp_nickname_id: transfer.sp_nickname_id,
        early_terminate_date: transfer.early_terminate_date,
        authorized_area_type: transfer.authorized_area_type,
        authorized_area_id: transfer.authorized_area_id,
      });
    } else {
      setTrans({
        id: undefined,
        contract_code: undefined,
        party_b_object_name: undefined,
        renewal_period: undefined,
        is_permanent: undefined,
        party_b_company_name: undefined,
        contract_termination_date: undefined,
        is_transfer: undefined,
        contract_start_date: undefined,
        authorized_area_name: undefined,
        contract_end_date: undefined,
        contract_agency_end: undefined,
        contract_expiry_date: undefined,
        agency_year: undefined,
        op_company_id: undefined,
        op_author_id: undefined,
        sp_company_id: undefined,
        op_nickname_id: undefined,
        sp_nickname_id: undefined,
        early_terminate_date: undefined,
        authorized_area_type: undefined,
        authorized_area_id: undefined,
      });
    }
  };

  const getArea = () => {
    switch (info.authorized_area_type) {
      case '1':
        return '自訂';
      case '2':
        return info.authorized_area_name;
      case '3':
        return `${info.authorized_area_name}`;
      case '4':
        return `${info.authorized_area_name}`;
      default:
        return undefined;
    }
  };

  const getYesOrNo = (value) => {
    switch (value) {
      case '0':
        return '否';
      case '1':
        return '是';
      default:
        return undefined;
    }
  };

  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: `確定要取消嗎？`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        history.push(`/contract/contract_song/adv/id/${match.params.id}`);
      },
      onCancel() {
      },
    });
  };

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title="合約轉換"
        className={styles.infoBanners}
      >
        <Card
          title="原有合約"
          bordered={false}
          className={styles.card}>
          <Card
            type="inner"
            title={
              <Row gutter={[8, 0]}>
                <Col md={8} xs={24}>
                  <p className={styles.om_r_0}>{info.contract_code ?? undefined}</p>
                </Col>
              </Row>
            }
            style={{ marginBottom: '24px' }}
            key={1}
          >
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>簽約對象：<span>{info.party_b_object ? info.party_b_object.name : ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>續約年限：<span>{info.renewal_period ? parseFloat(info.renewal_period) : ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>永久：<span>{info.is_permanent === '1' ? '是' : '否'}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>簽約單位：<span>{info.party_b_company ? info.party_b_company.name : ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>合約終止：<span>{info.contract_termination_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>轉讓：<span>{info.is_transfer === '1' ? '是' : '否'}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>合約開始日：<span>{info.contract_start_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>授權地區：<span>{info.authorized_area_name ?? ''}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>合約到期日：<span>{info.contract_end_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>代理到期日提前終止：<span>{info.contract_agency_end ?? ''}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>合約有效日：<span>{info.contract_expiry_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>代理年限：<span>{info.agency_year ? parseFloat(info.agency_year): ''}</span></p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Card>
        <Card
          title="轉換合約"
          bordered={false}
          className={styles.card}
        >
          <Select defaultValue="0" options={getOptions()} style={{ width: '20%' }} onChange={selectChange}/>
          <Input id="new_contract_id" value={trans} type="hidden"/>
          <Card
            className={styles.card}
            style={{ marginBottom: '24px', marginTop: '30px' }}
            key={1}
          >
            <Input id="new_contract_id" value={trans.id ?? undefined} type="hidden"/>
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>簽約對象：<span>{trans.party_b_object_name ?? ''}</span>
                    </p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>續約年限：<span>{trans.renewal_period ? parseFloat(trans.renewal_period) : ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>永久：<span>{getYesOrNo(trans.is_permanent ?? '')}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>簽約單位：<span>{trans.party_b_company_name ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>合約終止：<span>{trans.contract_termination_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>轉讓：<span>{getYesOrNo(trans.is_transfer ?? '')}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>合約開始日：<span>{trans.contract_start_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>授權地區：<span>{trans.authorized_area_name ?? ''}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>合約到期日：<span>{trans.contract_end_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>代理到期日提前終止：<span>{trans.contract_agency_end ?? ''}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>合約有效日：<span>{trans.contract_expiry_date ?? ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>代理年限：<span>{trans.agency_year ? parseFloat(trans.agency_year) : ''}</span></p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Card>
      </PageHeaderWrapper>
      <FooterToolbar>
        <Button
          onClick={() => showConfirm()}
        >取消</Button>
        <Button
          type="primary"
          className={styles.submitBtnWidth}
          onClick={submit}
        >送出</Button>
      </FooterToolbar>
    </Spin>
  );
};

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loading: loading.models.contractSongList,
}))(Transfer);
