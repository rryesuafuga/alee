package farm.alee.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import farm.alee.app.ui.Screen
import farm.alee.app.ui.theme.*

@Composable
fun HomeScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        // Hero section
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.linearGradient(
                        colors = listOf(AleeDark, Color(0xFF1B2D45), Color(0xFF0D3B2A))
                    )
                )
                .padding(24.dp)
        ) {
            Column {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Welcome to Alee",
                    color = Color.White,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    "AI-Powered Smart Farming",
                    color = AleePrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Quick stats
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    StatCard("0", "Scans Today", AleePrimary)
                    StatCard("--", "Farm Health", AleeSecondary)
                    StatCard("0", "Alerts", AleeAccent)
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick Actions
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                "Quick Actions",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ActionCard(
                    title = "Scan Plant",
                    subtitle = "AI Disease Detection",
                    icon = Icons.Default.CameraAlt,
                    color = AleePrimary,
                    modifier = Modifier.weight(1f),
                    onClick = { navController.navigate(Screen.Scan.route) }
                )
                ActionCard(
                    title = "Check Sensors",
                    subtitle = "Soil & Weather",
                    icon = Icons.Default.Sensors,
                    color = AleeSecondary,
                    modifier = Modifier.weight(1f),
                    onClick = { navController.navigate(Screen.Sensors.route) }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ActionCard(
                    title = "My Farm",
                    subtitle = "Manage Plots",
                    icon = Icons.Default.Landscape,
                    color = AleeAccent,
                    modifier = Modifier.weight(1f),
                    onClick = { navController.navigate(Screen.Farm.route) }
                )
                ActionCard(
                    title = "Get Advice",
                    subtitle = "SMS Advisories",
                    icon = Icons.Default.Lightbulb,
                    color = AleePink,
                    modifier = Modifier.weight(1f),
                    onClick = { navController.navigate(Screen.Advisories.route) }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // How it works
            Text(
                "How Disease Detection Works",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            HowItWorksStep(1, "Select Plant Part", "Choose leaves, stem, base, or fruit", AleePrimary)
            HowItWorksStep(2, "Take a Photo", "Close-up of the affected area", AleeSecondary)
            HowItWorksStep(3, "AI Analyses", "On-device ML in under 3 seconds", AleeAccent)
            HowItWorksStep(4, "Get Treatment", "Chemical, organic, and environmental solutions", AleeDanger)

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun StatCard(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = color, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text(label, color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp)
    }
}

@Composable
private fun ActionCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.08f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(icon, contentDescription = title, tint = color, modifier = Modifier.size(28.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text(subtitle, fontSize = 11.sp, color = Color.Gray)
        }
    }
}

@Composable
private fun HowItWorksStep(step: Int, title: String, description: String, color: Color) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(color),
            contentAlignment = Alignment.Center
        ) {
            Text("$step", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(description, fontSize = 12.sp, color = Color.Gray)
        }
    }
}
