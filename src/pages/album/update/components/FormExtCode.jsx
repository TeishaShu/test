import React, { useState, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Spin,
  Input,
} from 'antd';
import { Link } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormExtCode = props => {
  const {
    form,
    extCodeList,
    setExtCodeList,
  } = props;

  return (
    <Form.List
      name="ext_code"
    >
      {(fields, { add, remove }) => {
        let arr = form.getFieldValue()['ext_code'];

        return (
          <Fragment>
            {fields.map((field, idx) => {
              return (
                <Row
                  gutter={[8, 8]}
                  key={`ext_code_${field.fieldKey}`}
                >
                  <Col flex="auto">
                    <Form.Item
                      {...field}
                      fieldKey={[field.fieldKey, 'ext_code']}
                      label={(idx === 0) ? 'Ext Code' : ''}
                      key={field.key}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col flex="100px"
                    style={(idx === 0) ? { marginTop: '30px' } : {}}
                  >
                    {
                      (idx === 0) ?
                        (<Button block onClick={() => { add(); }}>新增編號</Button>) :
                        (
                          <Button
                            type="link"
                            block
                            onClick={() => {
                              remove(field.name);
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

export default FormExtCode;

