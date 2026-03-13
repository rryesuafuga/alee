package farm.alee.app.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import farm.alee.app.ui.screens.*

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    data object Home : Screen("home", "Home", Icons.Default.Home)
    data object Scan : Screen("scan", "Scan", Icons.Default.CameraAlt)
    data object Farm : Screen("farm", "My Farm", Icons.Default.Landscape)
    data object Sensors : Screen("sensors", "Sensors", Icons.Default.Sensors)
    data object Advisories : Screen("advisories", "Advice", Icons.Default.Lightbulb)
}

val bottomNavItems = listOf(
    Screen.Home,
    Screen.Scan,
    Screen.Farm,
    Screen.Sensors,
    Screen.Advisories,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AleeApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            NavigationBar {
                bottomNavItems.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) { HomeScreen(navController) }
            composable(Screen.Scan.route) { ScanScreen() }
            composable(Screen.Farm.route) { FarmScreen() }
            composable(Screen.Sensors.route) { SensorScreen() }
            composable(Screen.Advisories.route) { AdvisoryScreen() }
        }
    }
}
