// Importando o createClient do Supabase
import { createClient } from '@supabase/supabase-js';

// Acessando as variáveis de ambiente para as credenciais
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

// Criando o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;