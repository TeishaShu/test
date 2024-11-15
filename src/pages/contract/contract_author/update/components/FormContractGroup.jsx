import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Radio,
  Select,
  Button,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormContractGroup = props => {
  /*
  ''  預設無選項
  '1' 建立群組 UI
  '2' 加入群組 UI
  '3' 退出群組 UI
  */
  const {
    form,
    contractGroup,
    setContractGroup,
    showConfirmExitContractGroup,
    groupMember,
  } = props;
  const [group3Member, setGroup3Member] = useState([]);

  // status 1
  const [isFetching, setIsFetching] = useState(false);
  const [isList, setIsList] = useState([]);
  let timer;
  const searchOption = (keyword) => {
    return new Promise((resolve, reject) => {
      setIsFetching(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        commFn.searchOption(keyword, '/Contract_author/contracts_without_group', (res) => {
          setIsList(res);
          setIsFetching(false);
          resolve(res);
        });
      }, 200);
    });
  }

  // status 2
  const [isFetching2, setIsFetching2] = useState(false);
  const [isList2, setIsList2] = useState([]);
  let timer2;
  const searchOption2 = (keyword) => {
    return new Promise((resolve, reject) => {
      setIsFetching2(true);
      clearTimeout(timer2);
      timer2 = setTimeout(() => {
        commFn.searchOption(keyword, '/Contract_author/contract_groups', (res) => {
          setIsList2(res);
          setIsFetching2(false);
          resolve(res);
        });
      }, 200);
    });
  }

  useEffect(() => {
    if (contractGroup != '3') {
      setIsList([]);
      setIsList2([]);
      clearTimeout(timer);
      clearTimeout(timer2);
      form.setFieldsValue({ contract_group_1: [] });
      form.setFieldsValue({ contract_group_2: '' });
      setGroup3Member([]);
    }
  }, [contractGroup]);

  return (
    <Fragment>
      {/* 1, 2 */}
      <Row
        gutter={[8, 8]}
        style={{ display: (contractGroup != '3') ? 'flex' : 'none' }}
      >
        <Col flex="100%">
          <Form.Item
            name="contract_group_radio"
            label="合約群組"
            style={{ marginBottom: '8px' }}
          >
            <Radio.Group
              options={[
                { label: '建立群組', value: '1' },
                { label: '加入群組', value: '2' },
              ]}
              onChange={(e) => {
                setContractGroup(e.target.value);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* 1 */}
      <Row
        gutter={[8, 8]}
        style={{ display: (contractGroup == '1') ? 'flex' : 'none' }}
      >
        <Col flex="100%">
          <Form.Item
            name="contract_group_1"
          >
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              optionLabelProp="label"
              filterOption={false}
              allowClear={true}
              notFoundContent={isFetching ? <Spin size="small" /> : null}
              onSearch={(value) => {
                searchOption(value);
              }}
            >
              {isList.filter((elem) => elem.contract_code != form.getFieldValue()['contract_code']).map(d => (
                <Option
                  key={d.id}
                  label={d.contract_code}
                >
                  {d.contract_code}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {/* 2 */}
      <Row
        gutter={[8, 8]}
        style={{ display: (contractGroup == '2') ? 'flex' : 'none' }}
      >
        <Col flex="100%">
          <Form.Item
            name="contract_group_2"
            style={{ marginBottom: '8px' }}
          >
            <Select
              showSearch
              optionFilterProp="children"
              optionLabelProp="label"
              filterOption={false}
              allowClear={true}
              notFoundContent={isFetching2 ? <Spin size="small" /> : null}
              onSearch={(value) => {
                searchOption2(value);
              }}
              onSelect={(value, option) => {
                setGroup3Member((option.text) ? (option.text.slice()) : []);
              }}
              onChange={(value, option) => {
                if (!value) {
                  setGroup3Member([]);
                }
              }}
            >
              {isList2.map(d => (
                <Option
                  key={d.contract_group_name}
                  label={d.contract_group_name}
                  text={d.group_members}
                >
                  {d.contract_group_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        style={{ display: (contractGroup == '2') ? 'flex' : 'none' }}
      >
        <Col flex="100%">
          <label>
            組合成員：
            {group3Member.map(((elem, idx) => <Fragment key={`group3Member_${idx}`}><br />{elem}</Fragment>))}
          </label>
        </Col>
      </Row>
      {/* 3 */}
      <Row
        gutter={[8, 8]}
        style={{ display: (contractGroup == '3') ? 'flex' : 'none' }}
      >
        <Col flex="auto">
          <Form.Item
            name="contract_group_3"
            label="合約群組"
            style={{ marginBottom: '8px' }}
          >
            <Input disabled={true} />
          </Form.Item>
        </Col>
        <Col flex="100px" style={{ marginTop: '30px' }}>
          <Button block onClick={() => {
            showConfirmExitContractGroup();
          }}>退出</Button>
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        style={{ display: (contractGroup == '3') ? 'flex' : 'none' }}
      >
        <Col flex="100%">
          <label>
            其他成員：
            {
              groupMember.map((elem, idx) => <Fragment key={`member_${idx}`}><br />{elem.contract_code}</Fragment>)
            }
          </label>
        </Col>
      </Row>
    </Fragment >
  );
}

export default FormContractGroup;