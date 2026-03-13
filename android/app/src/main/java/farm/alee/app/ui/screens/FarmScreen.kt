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
fun FarmScreen() {
    var showAddFarm by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text("My Farm", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                Text("Manage your plots and crops", fontSize = 14.sp, color = Color.Gray)
            }
            FilledIconButton(
                onClick = { showAddFarm = true },
                colors = IconButtonDefaults.filledIconButtonColors(containerColor = AleePrimary)
            ) {
                Icon(Icons.Default.Add, "Add farm")
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Demo farm card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(AleePrimary.copy(alpha = 0.1f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Landscape, "farm", tint = AleePrimary)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Demo Farm", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Kassanda District", fontSize = 12.sp, color = Color.Gray)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider()
                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    FarmStat("4", "Acres", AleePrimary)
                    FarmStat("3", "Plots", AleeSecondary)
                    FarmStat("1,600", "Plants", AleeAccent)
                    FarmStat("2", "Sensors", AleePink)
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Plots
                Text("Plots", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(8.dp))

                PlotCard("North Plot", "Gonja (Plantain)", "600 plants", "Healthy", AleePrimary)
                PlotCard("South Plot", "Matooke", "500 plants", "Warning", AleeAccent)
                PlotCard("East Plot", "Gonja (Plantain)", "500 plants", "Healthy", AleePrimary)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Recent activity
        Text("Recent Scans", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(modifier = Modifier.height(8.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF7FAFC))
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Default.History, "history", tint = Color.LightGray, modifier = Modifier.size(32.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("No scans yet", color = Color.Gray, fontSize = 14.sp)
                Text("Scan your first plant to see results here", color = Color.LightGray, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun FarmStat(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = color)
        Text(label, fontSize = 11.sp, color = Color.Gray)
    }
}

@Composable
private fun PlotCard(name: String, crop: String, plants: String, status: String, color: Color) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
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
                Text(name, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                Text("$crop · $plants", fontSize = 11.sp, color = Color.Gray)
            }
            AssistChip(
                onClick = {},
                label = { Text(status, fontSize = 10.sp) },
                colors = AssistChipDefaults.assistChipColors(containerColor = color.copy(0.12f))
            )
        }
    }
}
