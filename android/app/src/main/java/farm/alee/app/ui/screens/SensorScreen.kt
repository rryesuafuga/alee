package farm.alee.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import farm.alee.app.ui.theme.*

@Composable
fun SensorScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("Sensor Dashboard", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
        Text("Real-time soil and environmental data", fontSize = 14.sp, color = Color.Gray)

        Spacer(modifier = Modifier.height(20.dp))

        // How sensors work — addresses Paul's feedback #2
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = AleeSecondary.copy(alpha = 0.05f))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Info, "info", tint = AleeSecondary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("How It Works", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    "Physical sensor probes are inserted 15–30cm into your soil. They measure moisture, pH, and nutrient levels automatically every 15 minutes. Data transmits wirelessly via LoRaWAN radio (up to 10km range) to your phone. No internet needed at the farm — the sensor has its own solar-powered radio.",
                    fontSize = 12.sp,
                    color = Color.DarkGray,
                    lineHeight = 18.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Sensor readings grid
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SensorCard("Moisture", "48%", "Optimal", AleePrimary, Modifier.weight(1f))
            SensorCard("pH", "6.3", "Optimal", AleeAccent, Modifier.weight(1f))
            SensorCard("Temp", "27°C", "Optimal", AleeSky, Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SensorCard("Nitrogen", "140", "Optimal", AleePrimary, Modifier.weight(1f))
            SensorCard("Phosphorus", "50", "Warning", AleeAccent, Modifier.weight(1f))
            SensorCard("Potassium", "190", "Optimal", AleePink, Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Chart placeholder
        Text("Moisture Trend (24h)", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(modifier = Modifier.height(8.dp))
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF7FAFC))
        ) {
            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.ShowChart, "chart", tint = Color.LightGray, modifier = Modifier.size(40.dp))
                    Text("Connect sensors to see live data", color = Color.Gray, fontSize = 12.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Advisory based on readings
        Text("Soil Advisory", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(modifier = Modifier.height(8.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = AleePrimary.copy(alpha = 0.05f))
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    "Your soil is in good condition. Moisture at 48% is within the optimal range (40-70%). Continue current watering schedule.",
                    fontSize = 13.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // SMS preview
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0F4F8))
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("SMS Preview", fontSize = 11.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    "[Alee] Farm looking good! Moisture 48%, pH 6.3. No action needed. Next check: Thursday.",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Hardware info
        Text("Sensor Hardware", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(modifier = Modifier.height(8.dp))

        HardwareItem("Capacitive Moisture Sensor v2.0", "0-100%, ±3% accuracy", "UGX 8,000", AleePrimary)
        HardwareItem("SEN0161-V2 pH Sensor", "3.5-9.0 pH, ±0.1 accuracy", "UGX 35,000", AleeAccent)
        HardwareItem("RS485 NPK Sensor", "N/P/K in mg/kg", "UGX 80,000", AleePink)
        HardwareItem("ESP32 + LoRa SX1276", "10km range, solar-powered", "UGX 45,000", AleeSecondary)

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF7FAFC))
        ) {
            Row(modifier = Modifier.padding(12.dp)) {
                Icon(Icons.Default.AttachMoney, "cost", tint = AleeAccent, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Total per sensor node: ~UGX 205,000 (~\$55 USD)", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun SensorCard(label: String, value: String, status: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.06f))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            when (status) {
                                "Optimal" -> AleePrimary
                                "Warning" -> AleeAccent
                                else -> AleeDanger
                            }
                        )
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(label, fontSize = 10.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text(
                status, fontSize = 10.sp, fontWeight = FontWeight.SemiBold,
                color = when (status) {
                    "Optimal" -> AleePrimary
                    "Warning" -> AleeAccent
                    else -> AleeDanger
                }
            )
        }
    }
}

@Composable
private fun HardwareItem(name: String, specs: String, cost: String, color: Color) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.04f))
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(color)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(name, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                Text(specs, fontSize = 11.sp, color = Color.Gray)
            }
            Text(cost, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}
