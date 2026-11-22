namespace AddisEats.Catalog;

public class CustomerClass
{
    public string Name { get; set; }

    public string Phone { get; set; }

    public CustomerClass(string name, string phone)
    {
        Name = name;
        Phone = phone;
    }
}
