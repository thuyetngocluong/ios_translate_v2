import { Button, Flex, Modal } from "antd";
import LanguageService from "../../services/LanguageService";
import AuthService from "../../services/AuthService";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/user.redux";


// function ListLanguageView(props: { selectedLanguageCodes: Set<string> }) {
//     return
// }

function SelectPreferLanguageView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLanguageCodes, setSelectedLanguageCodes] = useState(
      new Set((AuthService.shared.currentUser?.prefered_languages.map(e => e.language_code) || []))
    );

    const dispatch = useDispatch()
  
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      const languages = LanguageService.shared.languages.filter(l => selectedLanguageCodes.has(l.language_code))
      AuthService.shared.updatePreferredLanguages(languages)
      .then(e => {
        dispatch(updateUser(AuthService.shared.currentUser))
        setIsModalOpen(false);
      })
      .catch(e => {
        setIsModalOpen(false);
      })
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
          return <Button type="primary" onClick={() => { toggleLanguage(e.language_code) }}>{e.language_name}</Button>;
        });
      let unselected = LanguageService.shared.languages
        .filter((e) => !selectedLanguageCodes.has(e.language_code))
        .map((e) => {
          return <Button type="default" onClick={() => { toggleLanguage(e.language_code) }}>{e.language_name}</Button>;
        });
      return [...selected, ...unselected];
    }
  
    return (
      <>
        <Button type="primary" onClick={showModal}>
          Set Preferred Language
        </Button>
        <Modal
          title="Set Preferred Language"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
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
      </>
    );
}

export default SelectPreferLanguageView;