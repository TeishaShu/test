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
      commFn.searchOption(keyword, '/Company', (res) => {
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
                <Row
                  gutter={[8, 8]}
                  key={`${isName}_${field.fieldKey}`}
                  style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                >
                  <Col flex="auto">
                    <Form.Item
                      {...field}
                      name={[field.name, 'company_nickname_id']}
                      fieldKey={[field.fieldKey, 'company_nickname_id']}
                      label={(num === 1) ? isLabel : ''}
                      key={`${isName}_company_nickname_id_${field.fieldKey}`}
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

                          // arrAddEdit[idx].company_id = (option) ? (option.textcpid) : '';
                          arrAddEdit[idx].company_nickname_id = (option) ? (option.key) : '';
                          arrAddEdit[idx].nickname = (option) ? (option.label) : '';
                          arrAddEdit[idx]['is_edit'] = '1';

                          form.setFieldsValue({ [isName]: arrAddEdit });

                          orgCpCodeList[idx] = (option) ? (option.text) : '';
                          setCpCodeList(orgCpCodeList);
                        }}
                        onFocus={() => {
                          let tmpCpList = cpList.slice();

                          tmpCpList[idx] = [];
                          setCpList(tmpCpList);

                          if (form.getFieldValue()[isName][idx] && form.getFieldValue()[isName][idx]['nickname']) {
                            searchOption(form.getFieldValue()[isName][idx]['nickname'], idx);
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
                                  key={d.id}
                                  label={d.nickname}
                                  text={d.company_code}
                                  // textcpid={d.company_id}
                                  showtext={`${d.nickname} (${d.company_code})`}
                                >
                                  {`${d.nickname} (${d.company_code})`}
                                </Option>
                              ))
                            )
                            : ([])
                        }
                      </Select>
                    </Form.Item>
                    <label className={styles.searchMutliLabel}>{(cpCodeList[idx]) ? `(${cpCodeList[idx]})` : ''}</label>
                  </Col>
                  <Col flex="100px"
                    style={(num === 1) ? { marginTop: '30px' } : {}}
                  >
                    {
                      (num === 1) ?
                        (<Button block onClick={() => { add(); }}>新增</Button>) :
                        (
                          <Button
                            type="link"
                            block
                            onClick={() => {
                              if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                let tmpCpCodeList = cpCodeList.slice();
                                tmpCpCodeList.splice(idx, 1);
                                setCpCodeList(tmpCpCodeList);

                                remove(field.name);
                              } else {
                                let updateArr = form.getFieldValue()[isName].slice();
                                updateArr[idx]['is_delete'] = '1';
                                form.setFieldsValue({ [isName]: updateArr });
                              }
                            }}
                          >
                            移除
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
    </Form.List>
  );
}

export default FormCompanyList;

