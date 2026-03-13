package farm.alee.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import farm.alee.app.ui.theme.*

@Composable
fun AdvisoryScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("Advisories", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
        Text("Personalised farming tips via app and SMS", fontSize = 14.sp, color = Color.Gray)

        Spacer(modifier = Modifier.height(20.dp))

        // Sample advisories
        AdvisoryCard(
            type = "Irrigation",
            priority = "High",
            message = "Soil moisture at 32% in South Plot. Water your plants today — apply 15 litres per plant at the base.",
            time = "Today, 6:00 AM",
            priorityColor = AleeDanger,
            icon = Icons.Default.WaterDrop
        )

        AdvisoryCard(
            type = "Fertiliser",
            priority = "Medium",
            message = "Potassium levels are low in North Plot. Apply 2kg muriate of potash per plant this week.",
            time = "Yesterday, 2:30 PM",
            priorityColor = AleeAccent,
            icon = Icons.Default.Science
        )

        AdvisoryCard(
            type = "Weather",
            priority = "Low",
            message = "Rain expected Thursday–Friday (60% probability). Hold off on watering South Plot. Good time to apply fertiliser before rain.",
            time = "2 days ago",
            priorityColor = AleeSky,
            icon = Icons.Default.Cloud
        )

        AdvisoryCard(
            type = "Disease Alert",
            priority = "High",
            message = "Black Sigatoka detected in a farm 2km north of you. Inspect your plants and consider preventive fungicide spray.",
            time = "3 days ago",
            priorityColor = AleeDanger,
            icon = Icons.Default.Warning
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Weekly summary
        Text("Weekly Summary", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(modifier = Modifier.height(8.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = AleePrimary.copy(alpha = 0.05f))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    SummaryStat("3", "Scans", AleePrimary)
                    SummaryStat("1", "Alert", AleeDanger)
                    SummaryStat("8/10", "Health", AleePrimary)
                    SummaryStat("4", "Tips Sent", AleeSecondary)
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    "Farm health score improved from 7/10 to 8/10 this week. Keep up the good work!",
                    fontSize = 12.sp,
                    color = Color.DarkGray
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // SMS delivery info
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0F4F8))
        ) {
            Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Sms, "sms", tint = AleeSecondary, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text("SMS Delivery", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    Text(
                        "Advisories are also sent as SMS to your registered phone number, even if you don't have the app open or internet access.",
                        fontSize = 11.sp, color = Color.Gray
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun AdvisoryCard(
    type: String,
    priority: String,
    message: String,
    time: String,
    priorityColor: Color,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = RoundedCornerShape(14.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(priorityColor.copy(alpha = 0.1f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, type, tint = priorityColor, modifier = Modifier.size(18.dp))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(type, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text(time, fontSize = 11.sp, color = Color.Gray)
                }
                AssistChip(
                    onClick = {},
                    label = { Text(priority, fontSize = 10.sp) },
                    colors = AssistChipDefaults.assistChipColors(containerColor = priorityColor.copy(0.12f))
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(message, fontSize = 13.sp, color = Color.DarkGray, lineHeight = 18.sp)
        }
    }
}

@Composable
private fun SummaryStat(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = color)
        Text(label, fontSize = 11.sp, color = Color.Gray)
    }
}
