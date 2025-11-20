namespace SiSProI.Functions;
using SSP.Models;
using System.Security.Cryptography;
using System.Text;

public class ClsEncrypt
{
    private readonly IConfiguration _configuration;
    private static readonly int iterations = 1000;
    private readonly string SContraseña = string.Empty;
    public ClsEncrypt(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        SContraseña = _configuration.GetValue<string>("EncryptPass") ?? throw new InvalidOperationException("EncryptPass no está configurado.");
    }
    public MoEncrypt FnsEncripta(string valor)
    {
        MoEncrypt Encriptado = new()
        {
            SEncrypt = SEncrypt(valor.Trim('\n').Trim('\r'), SContraseña)
        };
        return Encriptado;
    }
    public MoEncrypt FnsEncriptaQR(string valor)
    {
        MoEncrypt Encriptado = new()
        {
            SEncrypt = SEncrypt(valor.Trim('\n').Trim('\r'), SContraseña)
        };
        return Encriptado;
    }
    public MoEncrypt FnsEncriptaValidar(string valor)
    {
        MoEncrypt Encriptado = new()
        {
            SEncrypt = SEncrypt(valor.Trim('\n').Trim('\r'), "eB,pSMj{5j8ef#0D82>9wQ782fTm>*$T")
        };
        return Encriptado;
    }
    public MoEncrypt FnsEncriptaKey(string valor, string sKey)
    {
        MoEncrypt Encriptado = new()
        {
            SEncrypt = SEncrypt(valor.Trim('\n').Trim('\r'), sKey)
        };
        return Encriptado;
    }
    public string FnsDesEncripta(string valor)
    {
        string plaintext = SDecrypt(valor, SContraseña);
        return plaintext;
    }
    public string FnsDesEncriptaVal(string valor)
    {
        string plaintext = SDecrypt(valor, "eB,pSMj{5j8ef#0D82>9wQ782fTm>*$T");
        return plaintext;
    }
    public string FnsDesEncriptaKey(string valor, string sKey)
    {
        string plaintext = SDecrypt(valor, sKey);
        return plaintext;
    }
    public string SEncrypt(string input, string password)
    {
        byte[] encrypted;
        byte[] IV;
        byte[] Salt = GetSalt();
        byte[] Key = CreateKey(password, Salt);
        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = Key;
            aesAlg.Padding = PaddingMode.PKCS7;
            aesAlg.Mode = CipherMode.CBC;
            aesAlg.GenerateIV();
            IV = aesAlg.IV;
            var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
            using var msEncrypt = new MemoryStream();
            using var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
            using (var swEncrypt = new StreamWriter(csEncrypt))
            {
                swEncrypt.Write(input);
            }
            encrypted = msEncrypt.ToArray();
        }
        byte[] combinedIvSaltCt = new byte[Salt.Length + IV.Length + encrypted.Length];
        Array.Copy(Salt, 0, combinedIvSaltCt, 0, Salt.Length);
        Array.Copy(IV, 0, combinedIvSaltCt, Salt.Length, IV.Length);
        Array.Copy(encrypted, 0, combinedIvSaltCt, Salt.Length + IV.Length, encrypted.Length);
        return Convert.ToBase64String(combinedIvSaltCt.ToArray());
    }
    public string SDecrypt(string input, string password)
    {
        byte[] inputAsByteArray;
        string? plaintext = null;
        try
        {
            inputAsByteArray = Convert.FromBase64String(input);
            byte[] Salt = new byte[32];
            byte[] IV = new byte[16];
            byte[] Encoded = new byte[inputAsByteArray.Length - Salt.Length - IV.Length];
            Array.Copy(inputAsByteArray, 0, Salt, 0, Salt.Length);
            Array.Copy(inputAsByteArray, Salt.Length, IV, 0, IV.Length);
            Array.Copy(inputAsByteArray, Salt.Length + IV.Length, Encoded, 0, Encoded.Length);
            byte[] Key = CreateKey(password, Salt);
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.IV = IV;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using var msDecrypt = new MemoryStream(Encoded);
                using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
                using var srDecrypt = new StreamReader(csDecrypt, Encoding.UTF8);
                plaintext = srDecrypt.ReadToEnd();
            }
            return plaintext;
        }
        catch (Exception ex)
        {
            return "";
            // throw new FEAException("SDecrypt", ex.Message, ex.InnerException ?? new Exception(), "ClsEncrypt", "");
        }
    }
    public byte[] CreateKey(string password, byte[] salt)
    {
        using var rfc2898DeriveBytes = new Rfc2898DeriveBytes(password, salt, iterations);
        return rfc2898DeriveBytes.GetBytes(32);
    }
    private static byte[] GetSalt()
    {
        var salt = new byte[32];
        RandomNumberGenerator.Fill(salt);
        return salt;
    }
}