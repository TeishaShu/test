import React, { useState, Fragment } from 'react';
import {
  Form,
  AutoComplete,
  Spin,
  Select,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormContractAuthorId = props => {
  const {
    form,
    isList,
    setIsList,
    soldDate,
    getUiSongDataForPack,
    setContractAuthorPartyB,
    isName,
    setIsName,
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/contract_misc/contracts_author_by_code', (res) => {
        let tmpRes = [];

        if (res) {
          res = res.filter((elem) => elem.contract_author && elem.contract_author.is_delete == '0');
          tmpRes = res.map((elem) => ({
            ui_id: `${elem.contract_author.id}_${(elem.subcontract_id) ? (elem.subcontract_id) : ''}`,
            id: elem.contract_author.id,
            contract_code: elem.contract_author.contract_code,
            subcontract_id: elem.subcontract_id,
            subcontract_code: elem.subcontract_code,
            subcontract_parent_author_name: elem.subcontract_parent_author_name,
            subcontract_author_name: elem.subcontract_author_name,
            settle_company_name: (elem.settle_company_name) ? (elem.settle_company_name) : null,
          }));
        }

        let tmpIsList = isList.slice();

        tmpIsList = tmpRes;
        setIsList(tmpIsList);
        setIsFetching(false);
      }, [{ key: 'release_date', value: (soldDate) ? (soldDate) : ('') }]);
    }, 200);
  }

  return (
    <Form.Item
      label="藝人發行合約"
      name="ui_contract_author_id"
      validateTrigger={['onClick', 'onBlur']}
    >
      <Select
        showSearch
        optionFilterProp="children"
        optionLabelProp="label"
        filterOption={false}
        allowClear={true}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        onSearch={(value) => {
          searchOption(value);
        }}
        onChange={(value, option) => {
          let tmpContractAuthorCode = '';

          if (value) {
            tmpContractAuthorCode = option.label;
          }

          setIsName(
            (option)
              ? (
                (option.subcontractcode)
                  ? (option.subcontractcode)
                  : (
                    (option.contractcode)
                      ? (option.contractcode)
                      : ('')
                  )
              )
              : ('')
          );

          setContractAuthorPartyB(
            (option)
              ? (
                (option.partybcompany)
                  ? (option.partybcompany)
                  : (
                    (option.partybauthorname)
                      ? (option.partybauthorname)
                      : (
                        (option.partybsubcontractparentauthorname)
                          ? (option.partybsubcontractparentauthorname)
                          : ('')
                      )
                  )
              )
              : ('')
          );

          form.setFieldsValue({
            is_edit: '1',
            contract_author_code: tmpContractAuthorCode,
          });

          getUiSongDataForPack();
        }}
        onFocus={() => {
          searchOption(isName);
        }}
        onSelect={(value, option) => {
          searchOption(
            (option)
              ? (
                (option.subcontractcode)
                  ? (option.subcontractcode)
                  : (
                    (option.contractcode)
                      ? (option.contractcode)
                      : ('')
                  )
              )
              : ('')
          );
        }}
      >
        {
          (isList)
            ? (
              isList.map(d => (
                <Option
                  key={d.ui_id}
                  contractid={d.id}
                  subcontractid={d.subcontract_id}
                  contractcode={d.contract_code}
                  subcontractcode={d.subcontract_code}
                  partybcompany={d.settle_company_name}
                  partybauthorname={d.subcontract_author_name}
                  partybsubcontractparentauthorname={d.subcontract_parent_author_name}
                  label={(d.subcontract_code) ? (`${d.contract_code} (${d.subcontract_code})`) : (d.contract_code)}
                >
                  {(d.subcontract_code) ? (`${d.contract_code} (${d.subcontract_code})`) : (d.contract_code)}
                </Option>
              ))
            )
            : ([])
        }
      </Select>
    </Form.Item>
  )
}

export default FormContractAuthorId;