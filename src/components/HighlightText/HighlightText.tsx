import {Typography} from "antd";
import {text} from "node:stream/consumers";


function HighlightText(props: {
    highlightTexts: string[]
    text: string
}) {

    function separate() {
        const highlightTexts = props.highlightTexts.map(e => e.trim().toLowerCase()).filter(e => e.length !== 0)

        if (highlightTexts.length === 0) return <Typography>{props.text}</Typography>;

        const separatorPattern = new RegExp(`(${highlightTexts.join('|')})`, 'ig');
        const parts = props.text.split(separatorPattern);

        return <Typography>
            {
                parts.map(part => {
                    if (highlightTexts.includes(part.toLowerCase())) {
                        return <span style={{ color: 'white', backgroundColor:'blue', padding: '2px', borderRadius: '2px' }}>{part}</span>
                    }
                    return part
                })
            }
        </Typography>
    }

    return separate()
}

export default HighlightText;