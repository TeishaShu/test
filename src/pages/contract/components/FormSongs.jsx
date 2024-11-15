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

const FormSongs = props => {
  const {
    form,
    isSelectName,
    isName,
    isLabel,
    isList,
    setIsList,
    selectVal,
    setSelectVal,
    isCodeList,
    setIsCodeList,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        let tmpCpList = isList.slice();
        tmpCpList[idx] = res;
        setIsList(tmpCpList);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Fragment>
      <Row
        gutter={[8, 8]}
      >
        <Col xs={24}>
          <Form.Item
            name={isSelectName}
            label={isLabel}
          >
            <Select
              options={[
                { value: '0', label: '無' },
                { value: '1', label: '全部' },
                { value: '2', label: '指定' },
              ]}
              onChange={(value) => {
                setSelectVal(value);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        style={{ display: (selectVal == '2') ? 'flex' : 'none' }}
      >
        <Col xs={24}>
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
                            name={[field.name, 'song_id']}
                            fieldKey={[field.fieldKey, 'song_id']}
                            label={isLabel}
                            key={`${isName}_song_id_${field.fieldKey}`}
                            className={styles.om_hide_label}
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
                                let orgIsCodeList = isCodeList.slice();
                                let arrAddEdit = form.getFieldsValue()[isName].slice();

                                arrAddEdit[idx].song_name = (option) ? (option.label) : '';
                                arrAddEdit[idx]['is_edit'] = '1';

                                form.setFieldsValue({ [isName]: arrAddEdit });

                                orgIsCodeList[idx] = (option) ? (option.songinfocode) : '';
                                setIsCodeList(orgIsCodeList);
                              }}
                              onFocus={() => {
                                let tmpCpList = isList.slice();

                                tmpCpList[idx] = [];
                                setIsList(tmpCpList);

                                if (form.getFieldValue()[isName][idx] && form.getFieldValue()[isName][idx]['song_name']) {
                                  searchOption(form.getFieldValue()[isName][idx]['song_name'], idx);
                                }
                              }}
                              onSelect={(value, option) => {
                                searchOption(option.label, idx);
                              }}
                            >
                              {
                                (isList && isList[idx])
                                  ? (
                                    isList[idx].map(d => (
                                      <Option
                                        key={d.id}
                                        label={d.song_name}
                                        songinfocode={d.song_code}
                                      >
                                        {`${d.song_name} (${d.song_code})`}
                                      </Option>
                                    ))
                                  )
                                  : ([])
                              }
                            </Select>
                          </Form.Item>
                          <label className={styles.searchMutliLabel}>{(isCodeList[idx]) ? `(${isCodeList[idx]})` : ''}</label>
                        </Col>
                        <Col flex="100px">
                          {
                            (num === 1) ?
                              (<Button block onClick={() => { add(); }}>新增</Button>) :
                              (
                                <Button
                                  type="link"
                                  block
                                  onClick={() => {
                                    if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                      let tmpIsCodeList = isCodeList.slice();
                                      tmpIsCodeList.splice(idx, 1);
                                      setIsCodeList(tmpIsCodeList);

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
        </Col>
      </Row>
    </Fragment>
  );
}

export default FormSongs;

