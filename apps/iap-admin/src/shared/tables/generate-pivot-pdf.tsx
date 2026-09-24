import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  cell: {
    borderBottomColor: '#d1d5db',
    borderBottomWidth: 1,
    borderRightColor: '#d1d5db',
    borderRightWidth: 1,
    flex: 1,
    padding: 4,
  },
  header: { backgroundColor: '#f3f4f6', fontWeight: 700 },
  page: { fontSize: 8, padding: 20 },
  row: { flexDirection: 'row' },
  total: { backgroundColor: '#f9fafb', fontWeight: 700 },
})

function normalizeFileName(fileName: string) {
  const trimmed = fileName.trim() || 'pivot-table'

  return trimmed.endsWith('.pdf') ? trimmed : `${trimmed}.pdf`
}

export async function downloadPivotPdf(props: {
  fileName: string
  header: string[]
  rows: string[][]
  totalRowIndex?: number
}) {
  const { fileName, header, rows, totalRowIndex } = props
  const document = (
    <Document>
      <Page orientation='landscape' size='A4' style={styles.page}>
        <View>
          <View style={styles.row}>
            {header.map((cell, index) => (
              <Text
                key={`${cell}-${index}`}
                style={[styles.cell, styles.header]}
              >
                {cell || '\u00a0'}
              </Text>
            ))}
          </View>
          {rows.map((row, rowIndex) => (
            <View key={`${row[0]}-${rowIndex}`} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <Text
                  key={`${rowIndex}-${cellIndex}`}
                  style={[
                    styles.cell,
                    ...(rowIndex === totalRowIndex ? [styles.total] : []),
                  ]}
                >
                  {cell || '\u00a0'}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
  const blob = await pdf(document).toBlob()
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')
  anchor.download = normalizeFileName(fileName)
  anchor.href = url
  anchor.click()
  URL.revokeObjectURL(url)
}
