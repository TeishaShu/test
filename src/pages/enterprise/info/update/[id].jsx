import React, { useState, useEffect } from 'react';
import {
  Spin,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Popover, message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FooterToolbar from '@/components/FooterToolbar';

export const Update = props => {
  const {
    loading,
    dispatch,
    enterpriseInfoList: { changeId, info },
    match,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'enterpriseInfoList/fetchGetInfo',
      payload: { id: match.params.id },
    });
  };

  const updateInfoValue = () => {
    form.setFieldsValue({
      tax_id_number: info.tax_id_number,
      name: info.name,
      name_zh: info.name_zh,
      name_en: info.name_en,
      admin: info.admin,
      zip_code: info.zip_code,
      address_zh: info.address_zh,
      phone: info.phone,
      fax: info.fax,
      email: info.email,
      website: info.website,
    });
  };

  // mount
  useEffect(() => {
    if (match.params.id) {
      setIsEdit(true);
      getData();
    }
  }, []);

  // updateData
  useEffect(() => {
    if (isEdit) {
      updateInfoValue();
    }
  }, [changeId]);

  // save
  const onFinish = values => {
    setError([]);
    const saveObj = { ...values, id: isEdit ? info.id : undefined };

    dispatch({
      type: isEdit ? 'enterpriseInfoList/fetchEditForm' : 'enterpriseInfoList/fetchAddForm',
      payload: saveObj,
      callback: (res) => {
        if (res && res.data !== 'error') {
          message.success(isEdit?'修改成功':'新增成功');
          history.push(isEdit ? `/enterprise/info/adv/id/${info.id}`: `/enterprise/info/adv/id/${res.data}`);
        }
      },
    });
  };

  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        history.push(isEdit ? `/enterprise/info/adv/id/${info.id}` : '/enterprise/info');
      },
      onCancel() {
      },
    });
  };

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    tax_id_number: '統一編號',
    name: '企業名稱',
    name_zh: '企業名稱(中)',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['role', 'type'];
    const cusFieldId = 'role';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (cusFields.includes(fieldKey)) {
        labelNode = document.getElementById(cusFieldId);
      }

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      let key = err.name[0];
      let renderFieldName = fieldLabels[key];
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i += 1) {
          key += err.name[i];
        }
      }

      if (!renderFieldName) {
        for (let i = 0; i < cusFields.length; i += 1) {
          if (key.indexOf(cusFields[i]) >= 0) {
            renderFieldName = fieldLabels[cusFieldId][cusFields[i]];
            break;
          }
        }

        renderSelector = cusFieldId;
      }

      return (
        <li key={key} className={errorStyles.errorListItem} onClick={() => scrollToField(renderSelector)}>
          <CloseCircleOutlined className={errorStyles.errorIcon}/>
          <div className={errorStyles.errorMessage}>{err.errors[0]}</div>
          <div className={errorStyles.errorField}>{renderFieldName}</div>
        </li>
      );
    });
    return (
      <span className={errorStyles.errorIcon}>
        <Popover
          title="表單驗證訊息"
          content={errorList}
          overlayClassName={errorStyles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined/>
        </Popover>
        {errorCount}
      </span>
    );
  };
  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  };

  return (
    <Spin
      tip="Loading..."
      spinning={loading ?? false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '修改企業' : '新增企業'}
        >
          <Card
            className={styles.card}
            bordered={false}
            title="基本資料"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="統一編號"
                  name='tax_id_number'
                  rules={[{ required: true, message: '統一編號為必填' }]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="企業名稱"
                  name='name'
                  rules={[{ required: true, message: '企業名稱為必填' }]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="企業名稱(中)"
                  name='name_zh'
                  rules={[{ required: true, message: '企業名稱(中)為必填' }]}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="企業名稱(英)"
                  name='name_en'
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="負責人"
                  name='admin'
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="郵遞區號"
                  name='zip_code'
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={12}
              >
                <Form.Item
                  label="地址(中)"
                  name='address_zh'
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="電話"
                  name='phone'
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="傳真"
                  name='fax'
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={13}
              >
                <Form.Item
                  label="Email"
                  name='email'
                  rules={[{ type: 'email', message: '電子信箱格式錯誤' }]}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={13}
              >
                <Form.Item
                  label="網站"
                  name='website'
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={styles.submitBtnWidth}
            onClick={() => form?.submit()}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
};

export default connect(({ enterpriseInfoList, loading }) => ({
  enterpriseInfoList,
  loading: loading.models.enterpriseInfoList,
}))(Update);
