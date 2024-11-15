import React, { useState, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const FormCompanyList = props => {
  const {
    form,
    isName,
    isLabel,
    cpList,
    setCpList,
    cpCodeList,
    setCpCodeList,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/author/author_name', (res) => {
        let tmpCpList = cpList.slice();
        tmpCpList[idx] = res;
        setCpList(tmpCpList);
        setIsFetching(false);
      });
    }, 200);
  }
  return (
    <Form.List
      name={isName}
    >
      {(fields, { add, remove }) => {
        let arr = form.getFieldValue()[isName];
        let num = 0;
        return (
          <Fragment>
            {fields.map((field, idx) => {
              if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                num++;
              }

              return (
                < Row
                  gutter={[8, 8]}
                  key={`${isName}_${field.fieldKey}`}
                  style={(arr[idx] && arr[idx]['is_delete'] == 1) ? { display: 'none' } : {}}
                >
                  <Col flex="auto">
                    <Form.Item
                      {...field}
                      name={[field.name, 'author_id']}
                      fieldKey={[field.fieldKey, 'author_id']}
                      label={(idx === 0) ? isLabel : ''}
                      key={`${isName}_author_id_${field.fieldKey}`}
                      rules={[
                        { required: true, message: '' },
                        {
                          validator(rule, values, callback) {
                            let result = (form.getFieldValue().party_b_object[idx] && form.getFieldValue().party_b_object[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

                            if (result !== false) {
                              callback();
                            } else {
                              callback(valid.checkRequired_msg)
                            }
                          }
                        }
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        optionLabelProp="label"
                        filterOption={false}
                        allowClear={true}
                        notFoundContent={isFetching ? <Spin size="small" /> : null}
                        onSearch={(value) => {
                          searchOption(value, idx);
                        }}
                        onChange={(value, option) => {
                          let orgCpCodeList = cpCodeList.slice();
                          let arrAddEdit = form.getFieldsValue()[isName].slice();
                          arrAddEdit[idx].author_id = (option) ? (option.key) : '';

                          form.setFieldsValue({ [isName]: arrAddEdit });
                          orgCpCodeList[idx] = (option) ? (option.text) : '';
                          setCpCodeList(orgCpCodeList);
                          setCpCodeList(orgCpCodeList);
                        }}
                        onFocus={() => {
                          let tmpCpList = cpList.slice();
                          tmpCpList[idx] = [];
                          setCpList(tmpCpList);

                          if (form.getFieldValue()[isName][idx] && form.getFieldValue()[isName][idx]['name']) {
                            searchOption(form.getFieldValue()[isName][idx]['name'], idx);
                          }
                        }}
                        onSelect={(value, option) => {
                          searchOption(option.label, idx);
                        }}
                      >
                        {
                          (cpList && cpList[idx])
                            ? (
                              cpList[idx].map(d => (
                                <Option
                                  key={`${d.id}`}
                                  label={d.name}
                                  text={d.author_code}
                                  showtext={`${d.name} (${d.author_code})`}
                                  style={(d['is_delete'] == 1) ? { display: 'none' } : {}}
                                >
                                  {`${d.name} (${d.author_code})`}
                                </Option>))
                            )
                            : ([])
                        }
                      </Select>
                    </Form.Item>
                    <label className={styles.searchMutliLabel}>
                      {(cpCodeList[idx]) ? `(${cpCodeList[idx]})` : ''}</label>
                  </Col>
                  <Col flex="100px"
                    style={(idx === 0) ? { marginTop: '30px' } : {}}
                  >
                    {
                      (idx === 0) ?
                        (<Button block onClick={() => { add(); }}>新增</Button>) :
                        (
                          <Button
                            type="link"
                            block
                            onClick={() => {
                              if (arr[idx] === undefined || arr[idx]['author_id'] === "") {
                                let tmpCpCodeList = cpCodeList.slice();
                                tmpCpCodeList.splice(idx, 1);
                                setCpCodeList(tmpCpCodeList);

                                remove(field.name);
                              } else {
                                let updateArr = form.getFieldValue()[isName].slice();
                                if (updateArr[idx]['is_edit'] === '1') {
                                  delete updateArr[idx]['is_edit'];
                                }
                                updateArr[idx]['is_delete'] = '1';
                                form.setFieldsValue({ [isName]: updateArr });
                              }
                            }}
                          >
                            移 除
                          </Button>
                        )
                    }
                  </Col>
                </Row>
              );
            })}
          </Fragment>
        );
      }}
    </Form.List >
  );
}

export default FormCompanyList;

