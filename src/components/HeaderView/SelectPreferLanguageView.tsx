import {Button, Flex, Modal} from "antd";
import LanguageService from "../../services/LanguageService";
import AuthService from "../../services/AuthService";
import {useEffect, useState} from "react";
import {RootState, useAppDispatch} from "../../redux/store";
import {reloadApplication} from "../../redux/application.slice";
import {useSelector} from "react-redux";

function SelectPreferLanguageView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguageCodes, setSelectedLanguageCodes] = useState(
      new Set((AuthService.shared.selectedApplication()?.languages.map(e => e.language_code) || []))
    );
    const selectedApplication = useSelector((state: RootState) => state.selectedApplication)
    const dispatch = useAppDispatch()

  useEffect(() => {
    setSelectedLanguageCodes(new Set((AuthService.shared.selectedApplication()?.languages.map(e => e.language_code) || [])))
  }, [isModalOpen]);
  
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      const languages = LanguageService.shared.languages.filter(l => selectedLanguageCodes.has(l.language_code))
        const application = selectedApplication.value
        if (application) {
            setIsLoading(true)
            AuthService.shared.updatePreferredLanguages(languages, application)
                .then(e => {
                    setIsLoading(false)
                    dispatch(reloadApplication())
                    setIsModalOpen(false);
                })
                .catch(e => {
                    setIsModalOpen(false);
                })
        }
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    const toggleLanguage = (languageCode: string) => {
      const result = new Set(selectedLanguageCodes)
  
      if (result.has(languageCode)) {
          result.delete(languageCode)
      } else {
          result.add(languageCode)
      }
      setSelectedLanguageCodes(result)
    }
  
    function build(selectedLanguageCodes: Set<string>) {
      let selected = LanguageService.shared.languages
        .filter((e) => selectedLanguageCodes.has(e.language_code))
        .map((e) => {
          return <Button key={e.language_code} type="primary" onClick={() => { toggleLanguage(e.language_code) }}>{e.language_name}</Button>;
        });
      let unselected = LanguageService.shared.languages
        .filter((e) => !selectedLanguageCodes.has(e.language_code))
        .map((e) => {
          return <Button  key={e.language_code}  type="default" onClick={() => { toggleLanguage(e.language_code) }}>{e.language_name}</Button>;
        });
      return [...selected, ...unselected];
    }
  
    return (
      <>
        <Button type="primary" onClick={showModal}>
          Set Preferred Language
        </Button>
        { isModalOpen ?
        <Modal
          title="Set Preferred Language"
          open={true}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={isLoading}
        >
          <Flex
            gap="small"
            align="center"
            wrap="wrap"
            style={{ overflowY: "auto", maxHeight: "60vh" }}
          >
            { build(selectedLanguageCodes) }
          </Flex>
        </Modal>
          : ""
        }
      </>
    );
}

export default SelectPreferLanguageView;