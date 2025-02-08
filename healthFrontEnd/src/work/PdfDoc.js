
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap"


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const PdfDoc = (props) => {


    return (
        <Modal isOpen={props.isPdfOpen}>
            <ModalBody>

                <div ref={props.refD}>
                    <Document file={`perscription${new Date()}.pdf`}>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section}>
                                <Text >
                                    Doctor
                                </Text>
                                <br />
                                <Text>
                                    {props.doctor}
                                </Text>
                            </View>
                            <br />
                            <br />
                            <View style={styles.section}>
                                <Text >
                                    Patient
                                </Text>
                                <br />
                                <Text>
                                    {props.patient}
                                </Text>
                            </View>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <View style={styles.section}>
                                <Text>
                                    Perscription
                                </Text>


                                <br />


                                <Text>
                                    {props.text}
                                </Text>

                            </View>
                            <br />
                            <View style={styles.section}>
                                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                    <Text>
                                        Signature
                                    </Text>
                                </div>
                            </View>
                            <br />
                            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }} >
                                <img src={props.url} style={{ width: '100px' }} />
                            </div>

                        </Page>
                    </Document>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => {
                    props.setIsPdfOpen(false)
                }}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default PdfDoc
