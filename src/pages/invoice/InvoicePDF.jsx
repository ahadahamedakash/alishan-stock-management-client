import {
  View,
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    position: "relative",
  },
  center: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    // height: 70,
    // marginBottom: 2,
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: "35%",
    transform: "translate(-50%, -50%)",
    opacity: 0.15,
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    fontSize: 10,
    marginBottom: 4,
  },
  hotline: {
    fontSize: 10,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  section: {
    marginBottom: 12,
  },

  sectionRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#000",
    marginBottom: 6,
  },
  sectionLabel: {
    width: 60,
    fontWeight: "bold",
  },
  sectionValue: {
    flex: 1,
  },
  underlineText: {
    textDecoration: "underline",
    marginBottom: 2,
    fontWeight: "bold",
  },
  borderedTable: {
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    minHeight: 20,
  },
  tableHeader: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  colSerial: {
    width: "10%",
    textAlign: "center",
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  colProduct: {
    width: "45%",
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  colQty: {
    width: "10%",
    textAlign: "center",
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  colPrice: {
    width: "15%",
    textAlign: "center",
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  colTotal: {
    width: "20%",
    textAlign: "center",
    padding: 4,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signature: {
    borderTopWidth: 1,
    borderColor: "#000",
    width: 150,
    textAlign: "center",
    paddingTop: 4,
    fontSize: 10,
  },
  thanks: {
    fontSize: 10,
    textAlign: "right",
  },
});

// Component
const InvoicePDF = ({ invoiceData }) => {
  const products = invoiceData?.products || [];
  const emptyRowsCount = Math.max(0, 18 - products.length);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Image src="/logo.png" style={styles.watermark} />

        {/* Header */}
        <View style={styles.center}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.address}>Painadi, Shiddhirganj, Narayanganj</Text>
          <Text style={styles.hotline}>Hotline: 01636222555, 10636888999</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.rowBetween}>
          <Text>Invoice No: #{invoiceData.invoiceNumber}</Text>
          <Text>
            Date:{" "}
            {new Date(invoiceData?.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Name:</Text>
            <Text style={styles.sectionValue}>
              {invoiceData.customerId?.name}
            </Text>
          </View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Phone:</Text>
            <Text style={styles.sectionValue}>
              {invoiceData.customerId?.phone}
            </Text>
          </View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Address:</Text>
            <Text style={styles.sectionValue}>
              {invoiceData.customerId?.address}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.borderedTable}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colSerial}>#</Text>
            <Text style={styles.colProduct}>Product</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {/* Product Rows */}
          {products.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.colSerial}>{i + 1}</Text>
              <Text style={styles.colProduct}>{item.productId?.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.price} Tk</Text>
              <Text style={styles.colTotal}>
                {item.quantity * item.price} Tk
              </Text>
            </View>
          ))}

          {/* Empty Rows to fill 15 total */}
          {Array.from({ length: emptyRowsCount }).map((_, i) => (
            <View style={styles.tableRow} key={`empty-${i}`}>
              <Text style={styles.colSerial}> </Text>
              <Text style={styles.colProduct}> </Text>
              <Text style={styles.colQty}> </Text>
              <Text style={styles.colPrice}> </Text>
              <Text style={styles.colTotal}> </Text>
            </View>
          ))}

          {/* Final 3 rows for totals */}
          <View style={styles.tableRow}>
            <Text style={styles.colSerial}> </Text>
            <Text style={styles.colProduct}> </Text>
            <Text style={styles.colQty}> </Text>
            <Text style={styles.colPrice}>Total</Text>
            <Text style={styles.colTotal}>{invoiceData.totalAmount} Tk</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colSerial}> </Text>
            <Text style={styles.colProduct}> </Text>
            <Text style={styles.colQty}> </Text>
            <Text style={styles.colPrice}>Paid</Text>
            <Text style={styles.colTotal}>{invoiceData.paidAmount} Tk</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colSerial}> </Text>
            <Text style={styles.colProduct}> </Text>
            <Text style={styles.colQty}> </Text>
            <Text style={styles.colPrice}>Due</Text>
            <Text style={styles.colTotal}>{invoiceData.dueAmount} Tk</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.signature}>Sign of Customer</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 8, marginBottom: 4 }}>
              With Thanks
            </Text>
            <Text
              style={{ textAlign: "center", fontWeight: "bold", fontSize: 12 }}
            >
              Alishan
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
