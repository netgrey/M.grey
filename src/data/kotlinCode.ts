export interface KotlinFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/mgrey/mentor/MainActivity.kt",
    language: "kotlin",
    content: `package com.mgrey.mentor

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.google.android.gms.ads.MobileAds
import com.mgrey.mentor.ui.theme.MGreyTheme
import com.mgrey.mentor.ui.screens.LoginScreen
import com.mgrey.mentor.ui.screens.ChatScreen
import com.mgrey.mentor.ui.screens.PlansScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Inicializa o SDK de Anúncios para Dispositivos Móveis da Google (AdMob)
        MobileAds.initialize(this) {}

        setContent {
            MGreyTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NavigationSetup()
                }
            }
        }
    }
}

@Composable
fun NavigationSetup() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "login"
    ) {
        composable("login") {
            LoginScreen(
                onNavigateToChat = { navController.navigate("chat") },
                onNavigateToPlans = { navController.navigate("plans") }
            )
        }
        composable("chat") {
            ChatScreen(
                onNavigateToPlans = { navController.navigate("plans") },
                onBackToLogin = { navController.popBackStack("login", false) }
            )
        }
        composable("plans") {
            PlansScreen(
                onBackToChat = { navController.navigate("chat") { popUpTo("chat") { inclusive = false } } },
                onBackToLogin = { navController.popBackStack("login", false) }
            )
        }
    }
}`
  },
  {
    name: "LoginScreen.kt",
    path: "app/src/main/java/com/mgrey/mentor/ui/screens/LoginScreen.kt",
    language: "kotlin",
    content: `package com.mgrey.mentor.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LoginScreen(
    onNavigateToChat: () -> Unit,
    onNavigateToPlans: () -> Unit
) {
    var isRegisterMode by remember { mutableStateOf(false) }
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    val backgroundBrush = Brush.verticalGradient(
        colors = listOf(Color(0xFF0C0F12), Color(0xFF11151C))
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundBrush)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Logo/Title
            Text(
                text = "M. GREY",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                color = Color(0xFFD6BE8A),
                letterSpacing = 2.sp
            )
            
            Text(
                text = "PORTAL DE AUTONOMIA E EVOLUÇÃO",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.LightGray,
                letterSpacing = 1.5.sp,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Subtitle
            Text(
                text = if (isRegisterMode) 
                    "Crie sua conta no portal para iniciar seu caminho de reestruturação cognitiva." 
                else 
                    "A autonomia não é herdada. Ela é assumida. Acesse seu portal.",
                fontSize = 14.sp,
                color = Color.Gray,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Campo Nome Completo (Somente no Cadastro)
            if (isRegisterMode) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Nome do Discípulo") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFFD6BE8A),
                        focusedLabelColor = Color(0xFFD6BE8A),
                        unfocusedBorderColor = Color(0xFF1F2633)
                    )
                )
            }

            // Outlined Fields
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("E-mail do Discípulo") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFD6BE8A),
                    focusedLabelColor = Color(0xFFD6BE8A),
                    unfocusedBorderColor = Color(0xFF1F2633)
                )
            )

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Senha de Autonomia") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFD6BE8A),
                    focusedLabelColor = Color(0xFFD6BE8A),
                    unfocusedBorderColor = Color(0xFF1F2633)
                )
            )

            // Campo Confirmar Senha (Somente no Cadastro)
            if (isRegisterMode) {
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    label = { Text("Confirmar Senha") },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFFD6BE8A),
                        focusedLabelColor = Color(0xFFD6BE8A),
                        unfocusedBorderColor = Color(0xFF1F2633)
                    )
                )
            }

            if (errorMessage.isNotEmpty()) {
                Text(
                    text = errorMessage,
                    color = Color.Red,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Primary Button
            Button(
                onClick = {
                    if (isRegisterMode) {
                        if (name.trim().isEmpty()) {
                            errorMessage = "Insira o nome do discípulo."
                        } else if (!email.contains("@")) {
                            errorMessage = "Insira um e-mail válido."
                        } else if (password.length < 6) {
                            errorMessage = "A senha deve conter no mínimo 6 dígitos."
                        } else if (password != confirmPassword) {
                            errorMessage = "As senhas não coincidem."
                        } else {
                            // Sucesso no cadastro, redirecionar para o chat
                            onNavigateToChat()
                        }
                    } else {
                        if (email.contains("@") && password.length >= 6) {
                            onNavigateToChat()
                        } else {
                            errorMessage = "Insira um e-mail válido e senha com no mínimo 6 dígitos."
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFAA7F38),
                    contentColor = Color(0xFF0C0F12)
                )
            ) {
                Text(
                    text = if (isRegisterMode) "CADASTRAR E ADENTRAR" else "ACESSAR CONTRAPONTO",
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }

            // Toggle Mode Button
            TextButton(onClick = { 
                isRegisterMode = !isRegisterMode 
                errorMessage = ""
            }) {
                Text(
                    text = if (isRegisterMode) "Já possui autonomia? Faça o login" else "Criar uma nova conta de discípulo",
                    color = Color(0xFFD6BE8A),
                    fontSize = 13.sp
                )
            }

            // Secondary Trigger button
            TextButton(onClick = onNavigateToPlans) {
                Text(
                    text = "Ver Planos de Mentoria VIP",
                    color = Color.Gray,
                    fontSize = 11.sp
                )
            }
        }
    }
}`
  },
  {
    name: "ChatScreen.kt",
    path: "app/src/main/java/com/mgrey/mentor/ui/screens/ChatScreen.kt",
    language: "kotlin",
    content: `package com.mgrey.mentor.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import com.mgrey.mentor.ui.components.AdMobBanner

data class Message(
    val id: String,
    val sender: String, // "user" or "mentor"
    val text: String,
    val time: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    onNavigateToPlans: () -> Unit,
    onBackToLogin: () -> Unit
) {
    var input by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    val messages = remember {
        mutableStateListOf(
            Message("1", "mentor", "Eu observo o seu silêncio. Mas o silêncio não gera evolução. O que você está ocultando hoje?", "10:00")
        )
    }

    var isLoading by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("M. GREY", fontSize = 18.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif)
                        Text("Mentor Evolutivo", fontSize = 10.sp, color = Color.Gray)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackToLogin) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Sair")
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToPlans) {
                        Icon(Icons.Default.Star, contentDescription = "Planos VIP", tint = Color(0xFFAA7F38))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF11151C),
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        },
        containerColor = Color(0xFF0C0F12)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Message History list
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(top = 16.dp, bottom = 16.dp)
            ) {
                items(messages) { message ->
                    val isUser = message.sender == "user"
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
                    ) {
                        Column(
                            modifier = Modifier
                                .widthIn(max = 290.dp)
                                .background(
                                    color = if (isUser) Color(0xFF1F2633) else Color(0xFF11151C),
                                    shape = RoundedCornerShape(
                                        topStart = 12.dp,
                                        topEnd = 12.dp,
                                        bottomStart = if (isUser) 12.dp else 0.dp,
                                        bottomEnd = if (isUser) 0.dp else 12.dp
                                    )
                                )
                                .padding(12.dp)
                        ) {
                            Text(
                                text = message.text,
                                color = Color.White,
                                fontSize = 14.sp,
                                lineHeight = 19.sp
                            )
                            Text(
                                text = message.time,
                                color = Color.Gray,
                                fontSize = 9.sp,
                                modifier = Modifier
                                    .align(Alignment.End)
                                    .padding(top = 4.dp)
                            )
                        }
                    }
                }

                if (isLoading) {
                    item {
                        Text(
                            text = "Márcio Grey está analisando suas desculpas...",
                            color = Color(0xFFD6BE8A),
                            fontSize = 12.sp,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )
                    }
                }
            }

            // Google AdMob Banner Ad positioned right above the chat input bar as requested by the guide
            AdMobBanner(
                modifier = Modifier.fillMaxWidth(),
                adUnitId = "ca-app-pub-2768032584424253/5647761119"
            )

            // Input Row block
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF11151C))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = input,
                    onValueChange = { input = it },
                    placeholder = { Text("Confronte sua mente...", fontSize = 14.sp) },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFFD6BE8A),
                        focusedLabelColor = Color(0xFFD6BE8A),
                        unfocusedBorderColor = Color(0xFF1F2633)
                    ),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )

                IconButton(
                    onClick = {
                        if (input.trim().isNotEmpty() && !isLoading) {
                            val userMsg = Message(
                                id = System.currentTimeMillis().toString(),
                                sender = "user",
                                text = input.trim(),
                                time = "Agora"
                            )
                            messages.add(userMsg)
                            val userQuery = input.trim()
                            input = ""
                            isLoading = true
                            
                            scope.launch {
                                listState.animateScrollToItem(messages.size - 1)
                                // Em produção: Chamar endpoint backend ou SDK Gemini
                                // Aqui simulamos a resposta imediata sob o Método M. Grey
                                kotlinx.coroutines.delay(1500)
                                val responseText = "Sua justificativa é apenas um véu para esconder o medo da autonomia. " +
                                                   "O que você vai mudar nas próximas 24 horas para reestruturar esse hábito nocivo?"
                                val mentorMsg = Message(
                                    id = System.currentTimeMillis().toString(),
                                    sender = "mentor",
                                    text = responseText,
                                    time = "Agora"
                                )
                                messages.add(mentorMsg)
                                isLoading = false
                                listState.animateScrollToItem(messages.size - 1)
                            }
                        }
                    },
                    modifier = Modifier.background(Color(0xFFAA7F38), shape = RoundedCornerShape(8.dp))
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Enviar", tint = Color(0xFF0C0F12))
                }
            }
        }
    }
}`
  },
  {
    name: "PlansScreen.kt",
    path: "app/src/main/java/com/mgrey/mentor/ui/screens/PlansScreen.kt",
    language: "kotlin",
    content: `package com.mgrey.mentor.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlansScreen(
    onBackToChat: () -> Unit,
    onBackToLogin: () -> Unit
) {
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("M. GREY UPGRADES", fontSize = 16.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif) },
                navigationIcon = {
                    IconButton(onClick = onBackToChat) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Voltar ao Chat")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF11151C),
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        },
        containerColor = Color(0xFF0C0F12)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(scrollState)
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                text = "ESCOLHA SEU NÍVEL DE COMPROMISSO",
                fontSize = 12.sp,
                color = Color(0xFFAA7F38),
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp,
                textAlign = TextAlign.Center
            )

            Text(
                text = "A evolução real exige investimento material e intencional. Menos desculpas, mais autonomia.",
                fontSize = 13.sp,
                color = Color.LightGray,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 8.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Plan 1: Membro Autônomo
            PlanCard(
                title = "Membro Autônomo",
                price = "R$ 49,90 / mês",
                features = listOf(
                    "Diálogos diários ilimitados com M. Grey",
                    "Auditoria comportamental semanal",
                    "Mapas de ação personalizados",
                    "Acesso aos gatilhos de reestruturação"
                ),
                isHighlight = false,
                buttonText = "ASSUMIR AUTONOMIA"
            )

            // Plan 2: Mentoria Direta Grey (HIGHLIGHT)
            PlanCard(
                title = "Mentoria Direta Grey",
                price = "R$ 299,90 / mês",
                features = listOf(
                    "Tudo do plano Autônomo",
                    "Espelhamento psicológico cirúrgico",
                    "Reuniões de Alinhamento Coletivas",
                    "Suporte prioritário e blindagem mental",
                    "Grupo VIP fechado no WhatsApp"
                ),
                isHighlight = true,
                buttonText = "UPGRADE DE ALTA PERFORMANCE"
            )
            
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun PlanCard(
    title: String,
    price: String,
    features: List<String>,
    isHighlight: Boolean,
    buttonText: String
) {
    val borderColor = if (isHighlight) Color(0xFFAA7F38) else Color(0xFF1F2633)
    val cardBg = if (isHighlight) Color(0xFF111520) else Color(0xFF11151C)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(cardBg, shape = RoundedCornerShape(12.dp))
            .border(1.5.dp, borderColor, shape = RoundedCornerShape(12.dp))
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                color = if (isHighlight) Color(0xFFD6BE8A) else Color.White
            )
            if (isHighlight) {
                Text(
                    text = "RECOMENDADO",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF0C0F12),
                    modifier = Modifier
                        .background(Color(0xFFAA7F38), shape = RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, py = 2.dp)
                )
            }
        }

        Text(
            text = price,
            fontSize = 24.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color.White
        )

        Divider(color = Color(0xFF1F2633), thickness = 1.dp)

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            features.forEach { feature ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Vantagem",
                        tint = Color(0xFFAA7F38),
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = feature,
                        color = Color.LightGray,
                        fontSize = 12.sp
                    )
                }
            }
        }

        Button(
            onClick = { /* Simulado */ },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isHighlight) Color(0xFFAA7F38) else Color(0xFF1F2633),
                contentColor = if (isHighlight) Color(0xFF0C0F12) else Color.White
            ),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text(text = buttonText, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
    }
}`
  },
  {
    name: "build.gradle.kts",
    path: "app/build.gradle.kts",
    language: "kotlin",
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.mgrey.mentor"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mgrey.mentor"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    
    // Jetpack Navigation para controlar a troca de telas
    implementation("androidx.navigation:navigation-compose:2.7.7")
    
    // SDK do Gemini para chamadas diretas no Android (Google GenAI)
    implementation("com.google.ai.client.generativeai:generativeai:0.2.2")
    
    // SDK de Anúncios para Dispositivos Móveis da Google (AdMob)
    implementation("com.google.android.gms:play-services-ads:23.0.0")
    
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}`
  },
  {
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mgrey.mentor">

    <!-- Permissões necessárias para carregar anúncios e conexões de rede -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MGreyTheme">
        
        <!-- ID do aplicativo Google AdMob do usuário -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-2768032584424253~1491069856" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MGreyTheme">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    name: "AdMobBanner.kt",
    path: "app/src/main/java/com/mgrey/mentor/ui/components/AdMobBanner.kt",
    language: "kotlin",
    content: `package com.mgrey.mentor.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView

/**
 * Componente Composable que encapsula e exibe um Banner do Google AdMob.
 * Utiliza o ID do Bloco de Anúncios (Ad Unit ID).
 */
@Composable
fun AdMobBanner(
    modifier: Modifier = Modifier,
    // ID do Bloco de Anúncios solicitado: ca-app-pub-2768032584424253/5647761119 (Bloco 1)
    adUnitId: String = "ca-app-pub-2768032584424253/5647761119" 
) {
    AndroidView(
        modifier = modifier
            .fillMaxWidth()
            .height(50.dp),
        factory = { context ->
            AdView(context).apply {
                setAdSize(AdSize.BANNER)
                setAdUnitId(adUnitId)
                loadAd(AdRequest.Builder().build())
            }
        },
        update = { adView ->
            // Atualiza o anúncio se necessário
            adView.loadAd(AdRequest.Builder().build())
        }
    )
}

/**
 * Preview de placeholder elegante para exibição em tempo de design (Vite/Compose preview)
 */
@Composable
fun AdMobBannerPlaceholder() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
            .background(Color(0xFF11151C)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Anúncio AdMob ativo - Bloco: ca-app-pub-2768032584424253/5647761119",
            color = Color(0xFFD6BE8A),
            fontSize = 10.sp
        )
    }
}`
  }
];
