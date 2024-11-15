import React, { useState, Fragment } from 'react';
import {
  Form,
  AutoComplete,
  Spin,
  Input,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = AutoComplete;

const FormAuthorStageName = props => {
  const {
    form,
    isName,
    isLabel,
    isName2,
    isList,
    setIsList,
    isHiddenLabel,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const [stageName, setStageName] = useState('');
  const [authorCode, setAuthorCode] = useState('');

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Author/author_stage', (res) => {
        setIsList(res);
        setIsFetching(false);
      }, [{ key: 'group', value: '1' }]);
    }, 200);
  }

  return (
    <Fragment>
      <Form.Item
        name={isName}
        label={isLabel}
        rules={[
          { required: true, message: '此欄位為必填' },
        ]}
      >
        <AutoComplete
          style={{ width: '100%' }}
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            let newObj = {};

            if (!value) {
              setStageName('');
              setAuthorCode('');
              newObj[isName2] = '';
              form.setFieldsValue(newObj);
            }

            if (option && option.key) {
              setStageName(option.obj.stage_name);
              setAuthorCode(option.obj.author_code);
              newObj[isName2] = option.obj.author_id;
              form.setFieldsValue(newObj);
            }
          }}
        >
          {
            (isList)
              ? (
                isList.map(d => (
                  <Option
                    key={d.id}
                    value={d.stage_name}
                    obj={d}
                  >
                    {`${d.stage_name} (${d.author_code})`}
                  </Option>
                ))
              )
              : ([])
          }
        </AutoComplete>
      </Form.Item>
      <label
        className={styles.searchLabel}
        style={{ display: (isHiddenLabel) ? 'none' : 'flex' }}
      >
        {(authorCode) ? `已選擇：${stageName} (${authorCode})` : ''}
      </label>
      <Form.Item
        name={isName2}
        noStyle
      >
        <Input type="hidden" />
      </Form.Item>
    </Fragment>
  );
}

export default FormAuthorStageName;