import React, { useState, Fragment, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  InputNumber,
  Button,
} from 'antd';
import styles from '@/style/style.less';

const { Option } = Select;

const FormCommission = props => {
  const {
    form,
    optCurrency,
    countryList,
  } = props;

  const [isSelect, setIsSelect] = useState([]);

  const tableStyle = {
    left1Td: {
      width: '300px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
    left2Td: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
    left3Td: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
      borderRight: '1.5px dotted #ECECEC',
    },
    rightTd: {
      width: '500px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
  };

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="扣佣比例"
    >
      <Row gutter={[64, 24]}>
        <Col
          xs={24}
        >
          <Form.Item
            name="currency_id"
            label="幣別"
            style={{ width: '150px' }}
            initialValue='1'
          >
            <Select options={optCurrency} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[64, 24]}>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <Form.List
            name="commission"
          >
            {(fields) => {
              return (
                <table className={styles.formTable}>
                  <tbody>
                    {fields.map((field, idx) => {
                      return (
                        <tr key={`test1_${field.key}`}>
                          <td style={tableStyle.left1Td}>
                            <Form.Item
                              shouldUpdate
                            >
                              {() => {
                                const arrOrgCommission = form.getFieldsValue().commission;
                                return (arrOrgCommission[idx] && arrOrgCommission[idx].name ? arrOrgCommission[idx].name : '');
                              }}
                            </Form.Item>
                          </td>
                          <Form.List
                            name={[field.name, 'percentage']}
                          >
                            {(percentage, { add, remove }) => {
                              let percentageNum = 0;

                              return (
                                <Fragment>
                                  {
                                    percentage.map((percentageField, percentageFieldIdx) => {
                                      if (percentageFieldIdx === 0 || percentageFieldIdx === 1) {
                                        return (
                                          <td
                                            key={percentageField.key}
                                            style={(percentageFieldIdx === 0) ? tableStyle.left2Td : tableStyle.left3Td}
                                          >
                                            <Form.Item
                                              {...percentageField}
                                              name={[percentageField.name, 'value']}
                                              fieldKey={[percentageField.fieldKey, 'key']}
                                              label={(percentageFieldIdx === 0 ? '台灣' : '其他地區')}
                                            >
                                              <InputNumber
                                                min="0"
                                                max="100"
                                              />
                                            </Form.Item>
                                          </td>
                                        );
                                      }
                                      return null;
                                    })
                                  }
                                  <td style={tableStyle.rightTd}>
                                    {
                                      percentage.map((percentageField, percentageFieldIdx) => {
                                        if (percentageFieldIdx !== 0 && percentageFieldIdx !== 1) {
                                          percentageNum += 1;

                                          return (
                                            <div
                                              key={`percentageFieldIdx_${percentageFieldIdx}`}
                                              style={{ display: 'flex', width: '100%' }}
                                            >
                                              <div style={{ flex: '400px', marginRight: '8px' }}>
                                                <Form.Item
                                                  {...percentageField}
                                                  name={[percentageField.name, 'authorized_country_id']}
                                                  fieldKey={[percentageField.fieldKey, 'authorized_country_id']}
                                                  key={percentageField.key}
                                                  label={(percentageNum === 1) ? ' ' : ''}
                                                >
                                                  <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    optionLabelProp="label"
                                                    allowClear
                                                    filterOption={(input, option) => {
                                                      return option.showtext.toLowerCase().indexOf(input.toLowerCase()) >= 0 && option.key !== '229';
                                                    }}
                                                    onChange={(data) => {
                                                      const checkSelect = isSelect.find(value => {
                                                        return value.key === percentageFieldIdx && value.index === idx;
                                                      });
                                                      if (checkSelect) {
                                                        checkSelect.isSelect = data;
                                                        setIsSelect([...isSelect]);
                                                      } else {
                                                        setIsSelect([...isSelect, {
                                                          key: percentageFieldIdx,
                                                          index: idx,
                                                          isSelect: data,
                                                        }]);
                                                      }
                                                    }}
                                                  >
                                                    {
                                                      (countryList)
                                                        ? (
                                                          countryList.map(d => (
                                                            <Option
                                                              key={d.id}
                                                              label={d.country_name_zh}
                                                              text={d.id}
                                                              showtext={`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
                                                              value={d.id}
                                                            >
                                                              {`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
                                                            </Option>
                                                          ))
                                                        )
                                                        : ([])
                                                    }
                                                  </Select>
                                                </Form.Item>
                                              </div>
                                              <div style={{
                                                flex: 'auto',
                                                marginRight: '8px',
                                              }}
                                              >
                                                <Form.Item
                                                  {...percentageField}
                                                  name={[percentageField.name, 'value']}
                                                  fieldKey={[percentageField.fieldKey, 'authorized_country_id']}
                                                  key={percentageField.key}
                                                  label={(percentageNum === 1) ? ' ' : ''}
                                                  className={styles.hideRequiredStar}
                                                  rules={[
                                                    {
                                                      required: isSelect.find((data) => {
                                                        return data.key === percentageFieldIdx && data.index === idx && data.isSelect !== undefined;
                                                      }), message: '此欄位為必填',
                                                    },
                                                  ]}
                                                >
                                                  <InputNumber
                                                    min="0"
                                                    max="100"
                                                  />
                                                </Form.Item>
                                              </div>
                                              <div
                                                style={{
                                                  flex: '100px',
                                                  marginTop: (percentageNum === 1) ? '30px' : '0',
                                                }}
                                              >
                                                {
                                                  (percentageNum === 1)
                                                    ? (
                                                      <Button
                                                        block
                                                        onClick={() => {
                                                          add();
                                                        }}
                                                      >
                                                        新增
                                                      </Button>
                                                    )
                                                    : (
                                                      <Button
                                                        type="link"
                                                        block
                                                        onClick={() => {
                                                          remove(percentageField.name);
                                                        }}
                                                      >
                                                        移除
                                                      </Button>
                                                    )
                                                }
                                              </div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      })
                                    }
                                  </td>
                                </Fragment>
                              );
                            }}
                          </Form.List>
                          <td>&nbsp;</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            }}
          </Form.List>
        </Col>
      </Row>
    </Card>
  );
};

export default FormCommission;
