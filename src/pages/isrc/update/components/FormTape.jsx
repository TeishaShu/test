import React, { useState, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Spin,
} from 'antd';
import { Link } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormTape = props => {
  const {
    form,
    tapeList,
    setTapeList,
    tapeCodeList,
    setTapeCodeList,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Company', (res) => {
        let tmpTapeList = tapeList.slice();
        tmpTapeList[idx] = res;
        setTapeList(tmpTapeList);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Form.List
      name="tape"
    >
      {(fields, { add, remove }) => {
        let arr = form.getFieldValue().tape;
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
                  key={`tape_${field.fieldKey}`}
                  style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                >
                  <Col flex="auto">
                    <Form.Item
                      {...field}
                      name={[field.name, 'company_nickname_id']}
                      fieldKey={[field.fieldKey, 'company_nickname_id']}
                      label={(num === 1) ? '母帶歸屬' : ''}
                      key={`tape_company_nickname_id_${field.fieldKey}`}
                      className={styles.addRequiredStar}
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
                          let orgTapeCodeList = tapeCodeList.slice();
                          let arrAddEdit = form.getFieldsValue().tape.slice();

                          arrAddEdit[idx].company_id = (option) ? (option.textcpid) : '';
                          arrAddEdit[idx].company_nickname_id = (option) ? (option.key) : '';
                          arrAddEdit[idx].company_name = (option) ? (option.label) : '';
                          if (arr[idx] && arr[idx].company_nickname_id) {
                            arrAddEdit[idx]['is_edit'] = '1';
                          }
                          form.setFieldsValue({ tape: arrAddEdit });

                          orgTapeCodeList[idx] = (option) ? (option.text) : '';
                          setTapeCodeList(orgTapeCodeList);
                        }}
                        onFocus={() => {
                          let tmpTapeList = tapeList.slice();

                          tmpTapeList[idx] = [];
                          setTapeList(tmpTapeList);

                          if (form.getFieldValue()['tape'][idx] && form.getFieldValue()['tape'][idx]['company_nickname']) {
                            searchOption(form.getFieldValue()['tape'][idx]['company_nickname'], idx);
                          }
                        }}
                        onSelect={(value, option) => {
                          searchOption(option.label, idx);
                        }}
                      >
                        {
                          (tapeList && tapeList[idx])
                            ? (
                              tapeList[idx].map(d => (
                                <Option
                                  key={d.id}
                                  label={d.nickname}
                                  text={d.company_code}
                                  textcpid={d.company_id}
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
                    <label className={styles.searchMutliLabel}>{(tapeCodeList[idx]) ? `(${tapeCodeList[idx]})` : ''}</label>
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
                                let tmpTapeList = tapeList.slice();
                                tmpTapeList.splice(idx, 1);
                                setTapeList(tmpTapeList);
                                let tmpTapeCodeList = tapeCodeList.slice();
                                tapeCodeList.splice(idx, 1);
                                setTapeCodeList(tapeCodeList);

                                remove(field.name);
                              } else {
                                let updateArr = form.getFieldValue().tape.slice();
                                updateArr[idx]['is_delete'] = '1';
                                form.setFieldsValue({ tape: updateArr });
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

export default FormTape;

